from flask import Flask, request, redirect, url_for, session, flash, render_template
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

# ========= DB: tabela e índices =========
def init_db():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS public.users (
                id BIGSERIAL PRIMARY KEY,
                name          TEXT        NOT NULL,
                email         TEXT        NOT NULL,
                cpf           TEXT        NOT NULL,
                password_hash TEXT        NOT NULL,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        """)
        cur.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_ci
            ON public.users (LOWER(email));
        """)
        cur.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS users_cpf_unique
            ON public.users (cpf);
        """)
        cur.execute("""
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = 'users_cpf_format_chk'
              ) THEN
                ALTER TABLE public.users
                ADD CONSTRAINT users_cpf_format_chk CHECK (cpf ~ '^[0-9]{11}$');
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
    """
    Envia e-mail usando Gmail (SSL 465).
    Requer MAIL_USER e MAIL_PASS (senha de app) no .env.
    """
    mail_user = os.getenv("MAIL_USER")
    mail_pass = os.getenv("MAIL_PASS")

    if not mail_user or not mail_pass:
        raise RuntimeError("MAIL_USER/MAIL_PASS não configurados no .env")

    reset_url = url_for("reset_password", token=token, _external=True)
    body = f"""
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Redefinição de senha - Participa Tere</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f6f7;font-family:'Segoe UI',Tahoma,Verdana,sans-serif;">
    <table align="center" width="100%" cellspacing="0" cellpadding="0" 
           style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08)">
      <tr>
        <td style="background:linear-gradient(135deg,#0e4d2c,#2e8b57);padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;font-size:22px;">Participa Terê</h1>
          <p style="margin:4px 0 0;font-size:14px;opacity:.9">Democracia direta em Teresópolis</p>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <h2 style="color:#2c3e50;font-size:20px;margin-top:0;">Redefinição de senha</h2>
          <p style="font-size:15px;color:#34495e;line-height:1.5;">
            Olá,<br><br>
            Recebemos um pedido para redefinir a sua senha no <strong>Participa Terê</strong>.
          </p>
          <p style="font-size:15px;color:#34495e;line-height:1.5;">
            Para criar uma nova senha, clique no botão abaixo. O link é válido por <strong>1 hora</strong>.
          </p>
          <p style="text-align:center;margin:30px 0;">
            <a href="{reset_url}" style="background:#3498db;color:white;text-decoration:none;font-weight:600;
              padding:14px 28px;border-radius:8px;display:inline-block;">
              Redefinir minha senha
            </a>
          </p>
          <p style="font-size:13px;color:#7f8c8d;line-height:1.4;">
            Se você não solicitou esta alteração, ignore este e-mail. Sua senha continuará a mesma.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#ecf0f1;padding:15px;text-align:center;font-size:12px;color:#7f8c8d;">
          © {date.today().year} Participa Terê — Teresópolis, RJ<br>
          Segurança e transparência na participação cidadã
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    msg = MIMEText(body, "html", _charset="utf-8")
    msg["Subject"] = "Recuperação de senha - Participa Terê"
    msg["From"] = mail_user
    msg["To"] = to_email

    # Envio
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
        cur.execute(
            "SELECT id, name, email, cpf FROM public.users WHERE id = %s",
            (session["user_id"],),
        )
        user = cur.fetchone()
    try:
        return render_template("home.html", user=user, title="Início")
    except TemplateNotFound:
        return f"Bem-vindo, {user['name']}! (Crie templates/home.html para uma página completa)"

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
                    INSERT INTO public.users (name, email, cpf, password_hash)
                    VALUES (%s, %s, %s, %s)
                """, (name, email, cpf, pw_hash))
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

# ====== NOVO: solicitar reset ======
@app.route("/forgot", methods=["GET", "POST"])
def forgot():
    if request.method == "POST":
        identifier = (request.form.get("identifier") or "").strip()

        if not identifier:
            flash("Informe seu e-mail ou CPF.", "warning")
            return render_template("forgot.html", title="Esqueci minha senha", identifier=identifier)

        # busca por email ou cpf
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
            # sucesso!
            flash("Enviamos um link de recuperação para o seu e-mail.", "success")
            return redirect(url_for("login"))
        except Exception as e:
            flash(f"Falha ao enviar e-mail: {e}", "danger")
            return render_template("forgot.html", title="Esqueci minha senha", identifier=identifier)

    return render_template("forgot.html", title="Esqueci minha senha")

# ====== NOVO: redefinir com token ======
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
            cur.execute(
                "UPDATE public.users SET password_hash=%s WHERE LOWER(email)=LOWER(%s)",
                (pw_hash, email),
            )
            conn.commit()
        flash("Senha redefinida! Agora você pode entrar.", "success")
        return redirect(url_for("login"))

    return render_template("reset.html", title="Redefinir senha", token=token)

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    flash("Você saiu da sua conta.", "info")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)