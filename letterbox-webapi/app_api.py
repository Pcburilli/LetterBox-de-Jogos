import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv # Senhas seguras no .env
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"]) # Suporte a comunicação em um unico PC e adicionado suporte ao envio de cookies para o front-end

app.config['SECRET_KEY'] = os.getenv('PASSWORD')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') # Utilizando PostgreSQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager(app)

# TABELAS do Bando de Dados
class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

    jogos = db.relationship('Usuarios_Jogos', backref='usuario', cascade="all, delete-orphan")
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

    usuario = db.relationship('Usuarios_Jogos', backref='jogo', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'rawg_id': self.rawg_id,
            'name': self.name,
            'ano': self.ano,
            'img_url': self.capa_url
        }

class Usuarios_Jogos(db.Model):
    __tablename__ = 'usuarios_jogos'
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id', ondelete='CASCADE'), primary_key=True)
    id_jogo = db.Column(db.Integer, db.ForeignKey('jogos.id', ondelete='CASCADE'), primary_key=True)
    data_adicionado = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'id_jogo': self.id_jogo,
            'data_adicionado': self.data_adicionado
        }

#Configuração de segurança de usuário
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Usuario, int(user_id))

# Configuração do @login_required para retornar JSON (401)
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({
        'mensagem': 'Acesso negado.'
    }), 401

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
        return jsonify('Jogo já cadastrado.'), 409
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
# Login
@app.route('/api/auth/login', methods=['POST'])
def login_usuario():
    dados_usuario = request.get_json()
    print('DADOS:', dados_usuario)
    email = dados_usuario['email'].lower()
    senha = dados_usuario['password']

    usuario = db.session.scalars(db.select(Usuario).filter_by(email=email)).first()
    if usuario and check_password_hash(usuario.senha, senha):
        login_user(usuario)
        return jsonify({
            'mensagem': 'Login realizado com sucesso!',
            'usuario': usuario.to_dict()
        }), 200
        
    return jsonify('Email ou Senha incorretas'), 401

# Logout
@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout_usuario():
    logout_user()

    resposta = make_response(jsonify({'mensagem': 'Logout realizado com sucesso!'}))
    resposta.set_cookie('session', '', expires=0)
    return resposta, 200

# Validar token
@app.route('/api/auth/me', methods=['GET'])
@login_required
def meu_perfil():
    return jsonify({
        'user_id': current_user.id,
        'email': current_user.email,
        'username': current_user.username
    }), 200

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
        return jsonify('Email ou username já cadastrado.'), 409
    return jsonify('Cadastro realizado.'), 200

# Alterar Username
@app.route('/api/register/username', methods=['PUT'])
@login_required
def alterar_username():
    username = request.get_json()['username'].lower().strip()
    current_user.username = username
    db.session.commit()

    return jsonify({
        'mensagem': 'Perfil atualizado com sucesso!',
    }), 200

# Retornar usuários
@app.route('/api/usuarios')
def listar_usuarios():
    usuarios = db.session.scalars(db.select(Usuario)).all()
    usuarios_dict = [u.to_dict() for u in usuarios]
    print(usuarios_dict)
    return jsonify(usuarios_dict), 200

# BIBLIOTECA USUÁRIO
# Retornar biblioteca
@app.route('/api/catalog', methods=['GET'])
@login_required
def meu_catalogo():
    jogos_do_usuario = db.session.query(Jogos)\
    .join(Usuarios_Jogos, Jogos.id == Usuarios_Jogos.id_jogo)\
    .filter(Usuarios_Jogos.id_usuario == current_user.id)\
    .all()
    jogos_do_usuario_dict = [u.to_dict() for u in jogos_do_usuario]
    return jsonify(jogos_do_usuario_dict), 200

# Adicionar Jogo a biblioteca
@app.route('/api/catalog/add', methods=['POST'])
@login_required
def add_jogo_catalogo():
    id_usuario = current_user.id
    id_jogo = request.get_json()['id_jogo']
    try:
        adicionar = Usuarios_Jogos(id_jogo=id_jogo, id_usuario=id_usuario)
        db.session.add(adicionar)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Jogo já cadastrado.'), 409
    return jsonify({
        'id_usuario': id_usuario,
        'id_jogo': id_jogo
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')