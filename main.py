from flask import Flask, request, redirect, url_for, session, flash, render_template, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from dotenv import load_dotenv
from jinja2 import TemplateNotFound

import os
import re
import pathlib
import psycopg
from datetime import date
from psycopg.rows import dict_row
from psycopg.errors import UniqueViolation

from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import smtplib
from email.mime.text import MIMEText

# ========= Config básica =========
load_dotenv()

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")  # troque em produção

# (debug opcional: confirme paths de template)
print("TEMPLATES:", pathlib.Path(app.template_folder).resolve())
print("INDEX exists?", (pathlib.Path(app.template_folder) / "index.html").exists())
print("CADASTRO exists?", (pathlib.Path(app.template_folder) / "cadastro.html").exists())

# ========= Conexão Postgres (Neon) =========
def get_conn():
    return psycopg.connect(
        host=os.getenv("PGHOST"),
        dbname=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        sslmode=os.getenv("PGSSLMODE", "require"),
        channel_binding=os.getenv("PGCHANNELBINDING", "require"),
        row_factory=dict_row,
    )

# ========= Utilidades/validações =========
DIGITS_RE = re.compile(r"\D+")

def clean_cpf(s: str) -> str:
    return "" if not s else DIGITS_RE.sub("", s)

def is_email(s: str) -> bool:
    return "@" in (s or "")

def validate_cpf(cpf: str) -> bool:
    cpf = clean_cpf(cpf)
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    dv1 = (soma * 10) % 11
    if dv1 == 10: dv1 = 0
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    dv2 = (soma * 10) % 11
    if dv2 == 10: dv2 = 0
    return cpf[-2:] == f"{dv1}{dv2}"

# ========= DB: esquema e índices =========
def init_db():
    with get_conn() as conn, conn.cursor() as cur:
        # USERS
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.users (
                id BIGSERIAL PRIMARY KEY,
                name          TEXT        NOT NULL,
                email         TEXT        NOT NULL,
                cpf           TEXT        NOT NULL,
                password_hash TEXT        NOT NULL,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                birthdate     DATE NULL,
                phone         TEXT NULL,
                gender        TEXT NULL,
                age_group     TEXT NULL,
                schooling     TEXT NULL,
                neighborhood  TEXT NULL
            );
        """)
        cur.execute("""CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_ci ON public.users (LOWER(email));""")
        cur.execute("""CREATE UNIQUE INDEX IF NOT EXISTS users_cpf_unique      ON public.users (cpf);""")
        cur.execute("""
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_cpf_format_chk') THEN
                ALTER TABLE public.users
                ADD CONSTRAINT users_cpf_format_chk CHECK (cpf ~ '^[0-9]{11}$');
              END IF;
            END$$;
        """)

        # PROPOSALS
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.proposals (
              id BIGSERIAL PRIMARY KEY,
              title        TEXT NOT NULL,
              description  TEXT NOT NULL,
              author_id    BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
              neighborhood TEXT,
              theme        TEXT,
              status       TEXT NOT NULL DEFAULT 'em_analise', -- em_analise | em_votacao | aprovada | rejeitada
              created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        """)
        cur.execute("""CREATE INDEX IF NOT EXISTS proposals_status_idx ON public.proposals (status);""")
        cur.execute("""CREATE INDEX IF NOT EXISTS proposals_theme_idx  ON public.proposals (theme);""")
        cur.execute("""CREATE INDEX IF NOT EXISTS proposals_neigh_idx  ON public.proposals (neighborhood);""")

        # VOTES
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.votes (
              user_id     BIGINT NOT NULL REFERENCES public.users(id)      ON DELETE CASCADE,
              proposal_id BIGINT NOT NULL REFERENCES public.proposals(id)  ON DELETE CASCADE,
              choice      BOOLEAN NOT NULL, -- TRUE = SIM, FALSE = NÃO
              created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
              PRIMARY KEY (user_id, proposal_id)
            );
        """)

        # COMMENTS
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.comments (
              id BIGSERIAL PRIMARY KEY,
              proposal_id BIGINT NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
              user_id     BIGINT NOT NULL REFERENCES public.users(id)     ON DELETE CASCADE,
              content     TEXT NOT NULL,
              created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
              moderated   BOOLEAN NOT NULL DEFAULT FALSE
            );
        """)

        # NOTIFICATIONS
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.notifications (
              id BIGSERIAL PRIMARY KEY,
              user_id    BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
              message    TEXT NOT NULL,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              read_at    TIMESTAMPTZ
            );
        """)

        # trigger para updated_at em proposals
        cur.execute("""
        CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
        BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
        """)
        cur.execute("""
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_proposals_updated_at') THEN
            CREATE TRIGGER trg_proposals_updated_at
            BEFORE UPDATE ON public.proposals
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
          END IF;
        END$$;
        """)

        conn.commit()

init_db()

# ========= Auth helper =========
def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            flash("Faça login para continuar.", "warning")
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapped

def current_user_id():
    return session.get("user_id")

# ===== Helpers de autorização (autor da proposta) =====
def is_author_of(pid: int, uid: int) -> bool:
    if not uid:
        return False
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT 1 FROM public.proposals WHERE id=%s AND author_id=%s", (pid, uid))
        return cur.fetchone() is not None

# ========= Recuperação de senha (tokens + e-mail) =========
serializer = URLSafeTimedSerializer(app.secret_key)

def generate_reset_token(email: str) -> str:
    return serializer.dumps(email, salt="reset-salt")

def verify_reset_token(token: str, max_age: int = 3600):
    try:
        return serializer.loads(token, salt="reset-salt", max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None

def send_reset_email(to_email: str, token: str):
    mail_user = os.getenv("MAIL_USER")
    mail_pass = os.getenv("MAIL_PASS")
    if not mail_user or not mail_pass:
        raise RuntimeError("MAIL_USER/MAIL_PASS não configurados no .env")

    reset_url = url_for("reset_password", token=token, _external=True)
    body = f"""
<!DOCTYPE html>
<html lang="pt-BR">
  <head><meta charset="UTF-8"><title>Redefinição de senha - Participa Tere</title></head>
  <body style="margin:0;padding:0;background:#f5f6f7;font-family:'Segoe UI',Tahoma,Verdana,sans-serif;">
    <table align="center" width="100%" cellspacing="0" cellpadding="0" 
           style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08)">
      <tr><td style="background:linear-gradient(135deg,#0e4d2c,#2e8b57);padding:20px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:22px;">Participa Terê</h1>
        <p style="margin:4px 0 0;font-size:14px;opacity:.9">Democracia direta em Teresópolis</p>
      </td></tr>
      <tr><td style="padding:30px;">
        <h2 style="color:#2c3e50;font-size:20px;margin-top:0;">Redefinição de senha</h2>
        <p style="font-size:15px;color:#34495e;line-height:1.5;">Olá,<br><br>Recebemos um pedido para redefinir a sua senha no <strong>Participa Terê</strong>.</p>
        <p style="font-size:15px;color:#34495e;line-height:1.5;">Para criar uma nova senha, clique no botão abaixo. O link é válido por <strong>1 hora</strong>.</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="{reset_url}" style="background:#3498db;color:white;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;display:inline-block;">Redefinir minha senha</a>
        </p>
        <p style="font-size:13px;color:#7f8c8d;line-height:1.4;">Se você não solicitou esta alteração, ignore este e-mail. Sua senha continuará a mesma.</p>
      </td></tr>
      <tr><td style="background:#ecf0f1;padding:15px;text-align:center;font-size:12px;color:#7f8c8d;">
        © {date.today().year} Participa Terê — Teresópolis, RJ<br>Segurança e transparência na participação cidadã
      </td></tr>
    </table>
  </body>
</html>
"""
    msg = MIMEText(body, "html", _charset="utf-8")
    msg["Subject"] = "Recuperação de senha - Participa Terê"
    msg["From"] = mail_user
    msg["To"] = to_email
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(mail_user, mail_pass)
        server.send_message(msg)

# ========= Rotas =========
@app.route("/")
def root():
    return redirect(url_for("login"))

@app.route("/home")
@login_required
def home():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, name, email, cpf FROM public.users WHERE id = %s", (session["user_id"],))
        user = cur.fetchone()

        cur.execute("SELECT COUNT(*) AS total FROM public.users")
        total_users = (cur.fetchone() or {}).get("total", 0)

        cur.execute("SELECT COUNT(*) AS total FROM public.proposals")
        total_proposals = (cur.fetchone() or {}).get("total", 0)

        cur.execute("SELECT COUNT(*) AS total FROM public.votes")
        total_votes = (cur.fetchone() or {}).get("total", 0)

    return render_template(
        "dashboard.html",
        user=user,
        title="Início",
        kpis={"users": total_users, "proposals": total_proposals, "votes": total_votes},
    )

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        identifier = (request.form.get("identifier") or "").strip()
        password = request.form.get("password", "")

        with get_conn() as conn, conn.cursor() as cur:
            if is_email(identifier):
                cur.execute("""
                    SELECT id, name, email, cpf, password_hash
                    FROM public.users
                    WHERE LOWER(email) = LOWER(%s)
                """, (identifier,))
            else:
                cpf = clean_cpf(identifier)
                cur.execute("""
                    SELECT id, name, email, cpf, password_hash
                    FROM public.users
                    WHERE cpf = %s
                """, (cpf,))
            user = cur.fetchone()

        if user and check_password_hash(user["password_hash"], password):
            session.clear()
            session["user_id"] = user["id"]
            flash("Login realizado com sucesso!", "success")
            return redirect(url_for("home"))

        flash("Credenciais inválidas.", "danger")

    return render_template("index.html", title="Entrar")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip().lower()
        cpf_in = (request.form.get("cpf") or "").strip()
        password = request.form.get("password", "")
        cpf = clean_cpf(cpf_in)

        birthdate = request.form.get("birthdate") or None
        raw_phone = request.form.get("phone") or ""
        phone = re.sub(r"\D", "", raw_phone) or None

        if not name or not email or not cpf or not password:
            flash("Preencha todos os campos.", "warning")
            return render_template("cadastro.html", title="Cadastro")

        if not validate_cpf(cpf):
            flash("CPF inválido.", "danger")
            return render_template("cadastro.html", title="Cadastro")

        pw_hash = generate_password_hash(password)

        try:
            with get_conn() as conn, conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO public.users (name, email, cpf, password_hash, birthdate, phone)
                    VALUES (%s,%s,%s,%s,%s,%s)
                """, (name, email, cpf, pw_hash, birthdate, phone))
                conn.commit()
            flash("Conta criada com sucesso!", "success")
            return redirect(url_for("login"))
        except UniqueViolation as e:
            msg = "E-mail ou CPF já cadastrado."
            if getattr(e, "diag", None) and e.diag.constraint_name:
                if "email" in e.diag.constraint_name:
                    msg = "Este e-mail já está cadastrado."
                elif "cpf" in e.diag.constraint_name:
                    msg = "Este CPF já está cadastrado."
            flash(msg, "danger")
        except Exception as e:
            flash(f"Erro ao criar conta: {e}", "danger")

    return render_template("cadastro.html", title="Cadastro")

# ====== Esqueci/reset de senha ======
@app.route("/forgot", methods=["GET", "POST"])
def forgot():
    if request.method == "POST":
        identifier = (request.form.get("identifier") or "").strip()
        if not identifier:
            flash("Informe seu e-mail ou CPF.", "warning")
            return render_template("forgot.html", title="Esqueci minha senha", identifier=identifier)

        with get_conn() as conn, conn.cursor() as cur:
            if is_email(identifier):
                cur.execute("SELECT email FROM public.users WHERE LOWER(email)=LOWER(%s)", (identifier,))
            else:
                cpf = clean_cpf(identifier)
                cur.execute("SELECT email FROM public.users WHERE cpf=%s", (cpf,))
            user = cur.fetchone()

        if not user:
            flash("Usuário não encontrado para o e-mail/CPF informado.", "danger")
            return render_template("forgot.html", title="Esqueci minha senha", identifier=identifier)

        try:
            token = generate_reset_token(user["email"])
            send_reset_email(user["email"], token)
            flash("Enviamos um link de recuperação para o seu e-mail.", "success")
            return redirect(url_for("login"))
        except Exception as e:
            flash(f"Falha ao enviar e-mail: {e}", "danger")
            return render_template("forgot.html", title="Esqueci minha senha", identifier=identifier)

    return render_template("forgot.html", title="Esqueci minha senha")

@app.route("/reset/<token>", methods=["GET", "POST"])
def reset_password(token):
    email = verify_reset_token(token)
    if not email:
        flash("Token inválido ou expirado.", "danger")
        return redirect(url_for("forgot"))

    if request.method == "POST":
        password = request.form.get("password", "").strip()
        if not password:
            flash("Informe a nova senha.", "warning")
            return render_template("reset.html", title="Redefinir senha", token=token)

        pw_hash = generate_password_hash(password)
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("UPDATE public.users SET password_hash=%s WHERE LOWER(email)=LOWER(%s)", (pw_hash, email))
            conn.commit()
        flash("Senha redefinida! Agora você pode entrar.", "success")
        return redirect(url_for("login"))

    return render_template("reset.html", title="Redefinir senha", token=token)

@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    session.clear()  # <-- corrigido
    flash("Você saiu da sua conta.", "info")
    return redirect(url_for("login"))

# ========= Módulos — páginas =========
@app.route("/propostas")
@login_required
def propostas():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT p.id, p.title, p.status, p.author_id,
                   COALESCE(p.neighborhood,'') AS neighborhood,
                   COALESCE(p.theme,'') AS theme,
                   u.name AS author_name,
                   COALESCE(SUM(CASE WHEN v.choice THEN 1 ELSE 0 END),0) AS yes,
                   COALESCE(SUM(CASE WHEN NOT v.choice THEN 1 ELSE 0 END),0) AS no
            FROM public.proposals p
            JOIN public.users u ON u.id = p.author_id
            LEFT JOIN public.votes v ON v.proposal_id = p.id
            GROUP BY p.id, u.name
            ORDER BY p.created_at DESC;
        """)
        items = cur.fetchall()
    return render_template("propostas.html", title="Propostas", items=items)

@app.route("/propostas/nova", methods=["GET","POST"])
@login_required
def propostas_nova():
    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        description = (request.form.get("description") or "").strip()
        neighborhood = (request.form.get("neighborhood") or "").strip()
        theme = (request.form.get("theme") or "").strip()
        status = request.form.get("status") or "em_analise"
        if not title or not description:
            flash("Título e descrição são obrigatórios.", "warning")
            return render_template("propostas_nova.html", title="Nova Proposta", form=request.form)
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO public.proposals (title, description, author_id, neighborhood, theme, status)
                VALUES (%s,%s,%s,%s,%s,%s)
                RETURNING id;
            """, (title, description, current_user_id(), neighborhood, theme, status))
            pid = cur.fetchone()["id"]
            conn.commit()
        flash("Proposta criada!", "success")
        return redirect(url_for("proposta_detalhe", pid=pid))
    return render_template("propostas_nova.html", title="Nova Proposta")

# ======= Editar proposta (autor somente; pode editar sempre) =======
@app.route("/propostas/<int:pid>/editar", methods=["GET", "POST"])
@login_required
def propostas_editar(pid):
    uid = current_user_id()
    if not is_author_of(pid, uid):
        flash("Você não tem permissão para editar esta proposta.", "danger")
        return redirect(url_for("proposta_detalhe", pid=pid))

    if request.method == "POST":
        title = (request.form.get("title") or "").strip()
        description = (request.form.get("description") or "").strip()
        neighborhood = (request.form.get("neighborhood") or "").strip()
        theme = (request.form.get("theme") or "").strip()
        status = (request.form.get("status") or "").strip() or None

        if len(title) < 5:
            flash("O título precisa de ao menos 5 caracteres.", "warning")
            return redirect(url_for("propostas_editar", pid=pid))

        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                UPDATE public.proposals
                   SET title=%s,
                       description=%s,
                       neighborhood=COALESCE(%s,''),
                       theme=COALESCE(%s,''),
                       status=COALESCE(%s, status)
                 WHERE id=%s AND author_id=%s
            """, (title, description, neighborhood, theme, status, pid, uid))
            conn.commit()

        flash("Proposta atualizada com sucesso.", "success")
        return redirect(url_for("propostas", pid=pid))

    # GET
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, title, description, neighborhood, theme, status
              FROM public.proposals
             WHERE id=%s AND author_id=%s
        """, (pid, uid))
        p = cur.fetchone()

    if not p:
        flash("Proposta não encontrada.", "danger")
        return redirect(url_for("propostas"))

    return render_template("propostas_editar.html", title=f"Editar: {p['title']}", p=p)

@app.route("/propostas/<int:pid>")
@login_required
def proposta_detalhe(pid):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT p.*, u.name AS author_name,
                   COALESCE(SUM(CASE WHEN v.choice THEN 1 ELSE 0 END),0) AS yes,
                   COALESCE(SUM(CASE WHEN NOT v.choice THEN 1 ELSE 0 END),0) AS no
            FROM public.proposals p
            JOIN public.users u ON u.id = p.author_id
            LEFT JOIN public.votes v ON v.proposal_id = p.id
            WHERE p.id=%s
            GROUP BY p.id, u.name;
        """, (pid,))
        prop = cur.fetchone()
        if not prop:
            flash("Proposta não encontrada.", "danger")
            return redirect(url_for("propostas"))

        cur.execute("""
            SELECT c.*, u.name AS user_name
            FROM public.comments c
            JOIN public.users u ON u.id = c.user_id
            WHERE c.proposal_id=%s
            ORDER BY c.created_at DESC;
        """, (pid,))
        comments = cur.fetchall()

    return render_template(
        "propostas_detalhe.html",
        title=prop["title"],
        prop=prop,
        comments=comments,
        pode_editar=(prop["author_id"] == current_user_id())
    )

@app.post("/propostas/<int:pid>/votar")
@login_required
def votar(pid):
    choice = (request.form.get("choice") or "").lower()
    if choice not in ("sim","nao"):
        flash("Escolha inválida.", "warning")
        return redirect(url_for("proposta_detalhe", pid=pid))
    yes = (choice == "sim")
    try:
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO public.votes (user_id, proposal_id, choice)
                VALUES (%s,%s,%s)
                ON CONFLICT (user_id, proposal_id)
                DO UPDATE SET choice=EXCLUDED.choice, created_at=now();
            """, (current_user_id(), pid, yes))
            conn.commit()
        flash("Voto registrado!", "success")
    except Exception as e:
        flash(f"Erro ao votar: {e}", "danger")
    return redirect(url_for("proposta_detalhe", pid=pid))

@app.post("/propostas/<int:pid>/comentar")
@login_required
def comentar(pid):
    content = (request.form.get("content") or "").strip()
    if not content:
        flash("Comentário vazio.", "warning")
        return redirect(url_for("proposta_detalhe", pid=pid))
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO public.comments (proposal_id, user_id, content)
            VALUES (%s,%s,%s);
        """, (pid, current_user_id(), content))
        conn.commit()
    flash("Comentário publicado!", "success")
    return redirect(url_for("proposta_detalhe", pid=pid))

@app.route("/votacoes")
@login_required
def votacoes():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT p.id, p.title, p.neighborhood, p.theme,
                   COALESCE(SUM(CASE WHEN v.choice THEN 1 ELSE 0 END),0) AS yes,
                   COALESCE(SUM(CASE WHEN NOT v.choice THEN 1 ELSE 0 END),0) AS no
            FROM public.proposals p
            LEFT JOIN public.votes v ON v.proposal_id = p.id
            WHERE p.status='em_votacao'
            GROUP BY p.id
            ORDER BY p.updated_at DESC;
        """)
        items = cur.fetchall()
    return render_template("votacoes.html", title="Votações Abertas", items=items)

@app.route("/comentarios")
@login_required
def comentarios():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT c.id, c.content, c.created_at, p.title AS proposal_title, u.name AS user_name
            FROM public.comments c
            JOIN public.proposals p ON p.id=c.proposal_id
            JOIN public.users u ON u.id=c.user_id
            ORDER BY c.created_at DESC
            LIMIT 50;
        """)
        items = cur.fetchall()
    return render_template("comentarios.html", title="Comentários", items=items)

@app.route("/identidade")
@login_required
def identidade():
    return render_template("identidade.html", title="Validação de Identidade")

@app.route("/painel")
@login_required
def painel():
    return redirect(url_for("home"))

@app.route("/historico")
@login_required
def historico_page():
    return render_template("historico.html", title="Histórico por Bairro/Tema")

@app.route("/notificacoes")
@login_required
def notificacoes_page():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT id, message, created_at, read_at
            FROM public.notifications
            WHERE user_id=%s
            ORDER BY created_at DESC;
        """, (current_user_id(),))
        items = cur.fetchall()
    return render_template("notificacoes.html", title="Notificações", items=items)

@app.route("/relatorios")
@login_required
def relatorios():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""SELECT neighborhood, COUNT(*) AS total FROM public.proposals GROUP BY neighborhood ORDER BY total DESC;""")
        por_bairro = cur.fetchall()
        cur.execute("""SELECT theme, COUNT(*) AS total FROM public.proposals GROUP BY theme ORDER BY total DESC;""")
        por_tema = cur.fetchall()
    return render_template("relatorios.html", title="Relatórios de Engajamento", por_bairro=por_bairro, por_tema=por_tema)

@app.route("/integracoes")
@login_required
def integracoes():
    return render_template("integracoes.html", title="Integrações Públicas")

# ======= Excluir proposta (autor somente) =======
@app.route("/propostas/<int:pid>/excluir", methods=["POST"])
@login_required
def propostas_excluir(pid):
    uid = current_user_id()
    if not is_author_of(pid, uid):
        flash("Você não tem permissão para excluir esta proposta.", "danger")
        return redirect(url_for("propostas"))

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("DELETE FROM public.proposals WHERE id=%s AND author_id=%s", (pid, uid))
        conn.commit()

    flash("Proposta excluída com sucesso.", "success")
    return redirect(url_for("propostas"))

# ========= APIs usadas pelo dashboard =========
api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/painel/resumo")
@login_required
def api_painel_resumo():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            WITH tot AS (
              SELECT p.id,
                     COALESCE(SUM(CASE WHEN v.choice THEN 1 ELSE 0 END),0) AS yes,
                     COALESCE(SUM(CASE WHEN NOT v.choice THEN 1 ELSE 0 END),0) AS no
              FROM public.proposals p
              LEFT JOIN public.votes v ON v.proposal_id=p.id
              GROUP BY p.id
            )
            SELECT p.title,
                   CASE p.status
                      WHEN 'em_analise' THEN 'Em análise'
                      WHEN 'em_votacao' THEN 'Em votação'
                      WHEN 'aprovada' THEN 'Aprovada'
                      WHEN 'rejeitada' THEN 'Rejeitada'
                      ELSE p.status
                   END AS status,
                   CASE WHEN (t.yes+t.no)=0 THEN 0 ELSE ROUND(100.0*t.yes/(t.yes+t.no)) END::INT AS suporte,
                   to_char(p.updated_at, 'YYYY-MM-DD') AS atualizado_em
            FROM public.proposals p
            LEFT JOIN tot t ON t.id=p.id
            ORDER BY p.updated_at DESC
            LIMIT 5;
        """)
        items = cur.fetchall()
    return jsonify(items=items)

@api_bp.route("/historico")
@login_required
def api_historico():
    bairro = request.args.get("bairro") or ""
    tema   = request.args.get("tema") or ""
    params = []
    where = []
    if bairro:
        where.append("p.neighborhood = %s")
        params.append(bairro)
    if tema:
        where.append("p.theme = %s")
        params.append(tema)
    where_sql = "WHERE " + " AND ".join(where) if where else ""

    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(f"""
            SELECT p.title AS titulo,
                   COALESCE(p.neighborhood,'') AS bairro,
                   COALESCE(p.theme,'') AS tema,
                   CASE p.status
                     WHEN 'aprovada' THEN 'Aprovada'
                     WHEN 'rejeitada' THEN 'Rejeitada'
                     WHEN 'em_votacao' THEN 'Em votação'
                     ELSE 'Em análise'
                   END AS resultado,
                   to_char(p.updated_at,'YYYY-MM-DD') AS data
            FROM public.proposals p
            {where_sql}
            ORDER BY p.updated_at DESC
            LIMIT 100;
        """, params)
        items = cur.fetchall()
    return jsonify(items=items)

@api_bp.route("/historico/bairros")
@login_required
def api_hist_bairros():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT neighborhood AS b
            FROM public.proposals
            WHERE neighborhood IS NOT NULL AND neighborhood <> ''
            ORDER BY b;
        """)
        items = [r["b"] for r in cur.fetchall()]
    return jsonify(items=items)

@api_bp.route("/historico/temas")
@login_required
def api_hist_temas():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT theme AS t
            FROM public.proposals
            WHERE theme IS NOT NULL AND theme <> ''
            ORDER BY t;
        """)
        items = [r["t"] for r in cur.fetchall()]
    return jsonify(items=items)

@api_bp.route("/notificacoes")
@login_required
def api_notificacoes():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT to_char(created_at,'HH24:MI') AS hora, message AS msg
            FROM public.notifications
            WHERE user_id=%s
            ORDER BY created_at DESC
            LIMIT 20;
        """, (current_user_id(),))
        items = cur.fetchall()
    return jsonify(items=items)

app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True)