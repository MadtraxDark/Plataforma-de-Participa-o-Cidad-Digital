from flask import Flask, request, redirect, url_for, session, flash, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from dotenv import load_dotenv
from jinja2 import TemplateNotFound

import os
import re
import pathlib
import psycopg
from psycopg.rows import dict_row
from psycopg.errors import UniqueViolation

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
        # fallback caso você ainda não tenha criado templates/home.html
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
            flash("Conta criada! Faça login.", "success")
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

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    flash("Você saiu da sua conta.", "info")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
