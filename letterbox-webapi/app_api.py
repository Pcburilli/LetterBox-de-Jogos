import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv # Senhas seguras no .env

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://192.168.1.4:3000"]) # Suporte a comunicação em um unico PC e adicionado suporte ao envio de cookies para o front-end

app.config['SECRET_KEY'] = os.getenv('PASSWORD')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') # Utilizando PostgreSQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = "login" # Se tentar acessar uma aba "login_required" será direcionado para login

# TABELAS do Bando de Dados
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

class Jogos(db.Model, UserMixin):
    __tablename__='jogos'
    id = db.Column(db.Integer, primary_key=True)
    rawg_id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(80), unique=True)
    ano = db.Column(db.String(15))
    capa_url = db.Column(db.Text)

    def to_dict(self): # Função que transforma informações em dicionário
        return {
            'id': self.id,
            'rawg_id': self.rawg_id,
            'name': self.name,
            'ano': self.ano,
            'img_url': self.capa_url
        }

#Configuração de segurança de usuário
@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Criar tabelas SQL
with app.app_context():
    db.create_all()

# API JOGOS
# Obter jogos
@app.route('/api/jogos')
def listar_jogos():
    jogos = db.session.scalars(db.select(Jogos)).all()
    jogos_dict = [u.to_dict() for u in jogos]
    return jsonify(jogos_dict), 200

# Adicionar jogo
@app.route('/api/jogos', methods=['POST'])
def adicionar_jogo():
    dados_jogo = request.get_json()['jogo']
    name = dados_jogo['name'].lower().strip()
    rawg_id = dados_jogo['id']
    ano = dados_jogo['released']
    capa_url = dados_jogo['background_image']

    try:
        novo_jogo = Jogos(name=name, rawg_id=rawg_id, ano=ano, capa_url=capa_url)
        db.session.add(novo_jogo)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Jogo já cadastrado.'), 400
    return jsonify('Cadastro do jogo realizado.'), 200

# Excluir jogo
@app.route('/api/jogos/<id>', methods=['DELETE'])
def excluir_jogo(id):
    jogo = db.get_or_404(Jogos, id)
    dados_jogo = jogo.to_dict()
    db.session.delete(jogo)
    db.session.commit()
    return jsonify(dados_jogo)

# API USUARIOS
# Autorizar acesso usuário
@app.route('/api/auth/usuario', methods=['POST'])
def validar_usuario():
    dados_usuario = request.get_json()
    print('DADOS:', dados_usuario)
    email = dados_usuario['email'].lower()
    senha = dados_usuario['password']

    usuario = db.session.scalars(db.select(Usuario).filter_by(email=email)).first()
    if usuario and check_password_hash(usuario.senha, senha):
        resposta = make_response(jsonify({'mensagem': 'Login aprovado.'})) # Make response -> controle total do headers, status code e cookies

        token_usuario = f"token_usuario{usuario.id}" # Token unico para cada usuario
        resposta.set_cookie(
            'token_usuario',
            value=token_usuario,
            httponly=True,
            max_age=86400
        ) # Configurando token e definindo algumas medidas de segurança
        return resposta, 200
        
    return jsonify('Email ou Senha incorretas'), 400

# Registrar usuário
@app.route('/api/register/usuario', methods=['POST'])
def registrar_usuario():
    dados_usuario = request.get_json()
    email = dados_usuario['email'].lower()
    senha = dados_usuario['password']

    senha_hash = generate_password_hash(senha)
    try:
        novo_usuario = Usuario(email=email, senha=senha_hash)
        db.session.add(novo_usuario)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Email ou username já cadastrado.'), 400
    return jsonify('Cadastro realizado.'), 200

# Retornar usuários
@app.route('/api/usuarios')
def listar_usuarios():
    usuarios = db.session.scalars(db.select(Usuario)).all()
    usuarios_dict = [u.to_dict() for u in usuarios]
    print(usuarios_dict)
    return jsonify(usuarios_dict), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')