import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv # Senhas seguras no .env

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('PASSWORD')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') # Utilizando PostgreSQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = "login" # Se tentar acessar uma aba "login_required" será direcionado para login

class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

    def to_dict(self): # Função que transforma informações em dicionário
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

with app.app_context():
    db.create_all() # Criar tabelas SQL

# Autorizar acesso usuário
@app.route('/api/auth/usuario', methods=['POST'])
def validar_usuario():
    dados_usuario = request.get_json()
    email = dados_usuario['email']
    senha = dados_usuario['password']

    usuario = db.session.scalars(db.select(Usuario).filter_by(email=email)).first()
    if usuario and check_password_hash(usuario.senha, senha):
        login_user(usuario)
        return jsonify('Login Válido.'), 200
        
    return jsonify('Login Inválido'), 400

# Registrar usuário
@app.route('/api/register/usuario', methods=['POST'])
def registrar_usuario():
    dados_usuario = request.get_json()
    username = dados_usuario['username']
    email = dados_usuario['email']
    senha = dados_usuario['password']

    senha_hash = generate_password_hash(senha)
    try:
        novo_usuario = Usuario(username=username, email=email, senha=senha_hash)
        db.session.add(novo_usuario)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({'erro': 'email já cadastrado.'}), 404
    return jsonify('Cadastro realizado.'), 200

# Retornar usuários
@app.route('/api/usuarios')
def listar_usuarios():
    usuarios = db.session.scalars(db.select(Usuario)).all()
    usuarios_dict = [u.to_dict() for u in usuarios]
    print(usuarios_dict)
    return jsonify(usuarios_dict), 200

if __name__ == '__main__':
    app.run(debug=True)