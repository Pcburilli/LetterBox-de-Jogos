import os
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv # Senhas seguras no .env
from datetime import datetime
from functools import wraps
import json

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"]) # Suporte a comunicação em um unico PC e adicionado suporte ao envio de cookies para o front-end

app.config['SECRET_KEY'] = os.getenv('PASSWORD')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') # Utilizando PostgreSQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

login_manager = LoginManager(app)

# Chamando tags_to_remove.json para aplicar filtro de tags a serem removidas
with open('tags_to_remove.json', 'r', encoding='utf-8') as f:
    tags_remove = set(json.load(f)['tags_to_remove'])

# TABELAS do Banco de Dados
class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(80), unique=True)
    icone_url = db.Column(db.String(255), nullable=True, default='/icons_user/icon1.png')
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    avaliacoes = db.relationship('Avaliacoes', backref='usuarios', cascade="all, delete-orphan")
    colecao = db.relationship('Usuarios_Jogos', backref='usuarios', lazy=True)

    def to_dict(self): # Função que transforma informações em dicionário
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'icone_url': self.icone_url
        }

class Jogos(db.Model):
    __tablename__='jogos'
    id = db.Column(db.Integer, primary_key=True)
    rawg_id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    name_slug = db.Column(db.String(80), nullable=False, unique=True)
    ano = db.Column(db.String(15), nullable=True)
    capa_url = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)

    usuarios = db.relationship('Usuarios_Jogos', backref='jogo', lazy=True, cascade="all, delete-orphan")
    desenvolvedores = db.relationship('Desenvolvedor_Jogos', backref='jogo', lazy=True, cascade="all, delete-orphan")
    tags = db.relationship('Tags_Jogos', backref='jogo', lazy=True, cascade="all, delete-orphan")
    avaliacoes = db.relationship('Avaliacoes', backref='jogo', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'rawg_id': self.rawg_id,
            'name': self.name,
            'name_slug': self.name_slug,
            'ano': self.ano,
            'img_url': self.capa_url,
            'description': self.description,
            'tags': [t.tag for t in self.tags],
            'desenvolvedores': [d.name for d in self.desenvolvedores]
        }

class Avaliacoes(db.Model):
    __tablename__ = 'avaliacoes'

    __table_args__ = (
        db.UniqueConstraint('usuario_id', 'jogo_id', name='uq_usuario_jogo_avaliacao'),
    )

    id = db.Column(db.Integer, primary_key=True)
    nota = db.Column(db.Integer, nullable=True)
    resenha = db.Column(db.Text, nullable=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogos.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'jogo_id': self.jogo_id,
            'nota': self.nota,
            'resenha': self.resenha,
        }

class Desenvolvedor_Jogos(db.Model):
    __tablename__ = 'desenvolvedor_jogos'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogos.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'jogo_id': self.jogo_id,
        }

class Tags_Jogos(db.Model):
    __tablename__ = 'tags_jogos'

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.Text, nullable=False)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogos.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'tag':self.tag,
            'jogo_id': self.jogo_id,
        }

class Usuarios_Jogos(db.Model):
    __tablename__ = 'usuarios_jogos'
    data_adicionado = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(db.Text, default='Na Fila')
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id', ondelete='CASCADE'), primary_key=True)
    jogo_id = db.Column(db.Integer, db.ForeignKey('jogos.id', ondelete='CASCADE'), primary_key=True)

    def to_dict(self):
        return {
            'usuario_id': self.usuario_id,
            'jogo_id': self.jogo_id,
            'data_adicionado': self.data_adicionado,
            'status': self.status,
        }

# Criar tabelas SQL
with app.app_context():
    db.create_all()

# Definir um usuário como admin
'''with app.app_context():
    admin = Usuario.query.filter_by(email='admin@admin.com').first()
    if admin:
        admin.is_admin = True
        db.session.commit()'''

#Configuração de segurança de usuário
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Usuario, int(user_id))

# Configuração do decorador @login_required para retornar JSON (401)
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({
        'mensagem': 'Acesso negado.'
    }), 401

# Decorador para verificar se um usuário é adm
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not getattr(current_user, 'is_admin', False):
            return jsonify({'erro': 'Acesso negado.'}), 403
        return f(*args, **kwargs)
    return decorated_function

# API JOGOS
# Obter jogos
@app.route('/api/jogos')
def listar_jogos():
    jogos = db.session.scalars(db.select(Jogos)).all()
    jogos_dict = [u.to_dict() for u in jogos]
    return jsonify(jogos_dict), 200

# Obter jogos via search (query string)
@app.route('/api/jogos/search')
def listar_jogos_search():
    termo = request.args.get('q', '').strip()
    page = request.args.get('page', default=1, type=int)

    jogos = db.select(Jogos)

    if termo:
        jogos = jogos.where(Jogos.name.ilike(f'%{termo}%'))

    paginacao = db.paginate(
            select=jogos,
            page=page,
            per_page=8,
            error_out=False
        )
    jogos_dict = [j.to_dict() for j in paginacao.items]

    return jsonify({
        'games': jogos_dict,
        'total_paginas': paginacao.pages
    }), 200

# Obter jogo via slug
@app.route('/api/jogos/<name_slug>')
def listar_jogo(name_slug):
    jogo = db.one_or_404(db.select(Jogos).filter_by(name_slug=name_slug))
    dados_jogo = jogo.to_dict()

    return jsonify(dados_jogo), 200

# Adicionar jogo
@app.route('/api/jogos', methods=['POST'])
@login_required
@admin_required
def adicionar_jogo():
    dados_jogo = request.get_json()
    name = dados_jogo['name'].strip()
    name_slug = name.lower().replace(' ', '-')
    rawg_id = dados_jogo['id']
    ano = dados_jogo['released']
    capa_url = dados_jogo['background_image']
    description = dados_jogo['description'].replace('<p>', '').replace('</p>', '').replace('<em>', '').replace('</em>', '').replace('<br />', '')
    tags = []
    for tag in dados_jogo['tags']:
        if tag['language'] == 'eng' and tag['slug'] not in tags_remove:
            tags.append(tag['slug'])
    for genre in dados_jogo['genres']:
        tags.append(genre['slug'])
    devs = []
    for developer in dados_jogo['developers']:
        devs.append(developer['slug'])

    try:
        # Adicionando informações na tabela jogos
        novo_jogo = Jogos(name=name, name_slug=name_slug, rawg_id=rawg_id, ano=ano, capa_url=capa_url, description=description)
        db.session.add(novo_jogo)
        db.session.flush() # Usando flush pq ele não finaliza a ação (como o commit)

        # Adicionando TAGS do jogo na tabela Tags_jogos
        for tag in tags:
            nova_tag = Tags_Jogos(jogo_id=novo_jogo.id, tag=tag)
            db.session.add(nova_tag)

        # Adicionando Desenvolvedor na tabela Desenvolvedor_Jogos
        for dev in devs:
            novo_dev = Desenvolvedor_Jogos(jogo_id=novo_jogo.id, name=dev)
            db.session.add(novo_dev)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Jogo já cadastrado.'), 409
    return jsonify('Cadastro do jogo realizado.'), 200

# Excluir jogo
@app.route('/api/jogos/<id>', methods=['DELETE'])
@login_required
@admin_required
def excluir_jogo(id):
    jogo = db.get_or_404(Jogos, id)
    dados_jogo = jogo.to_dict()
    db.session.delete(jogo)
    db.session.commit()
    return jsonify(dados_jogo), 200

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

# Validar token_user
@app.route('/api/auth/me', methods=['GET'])
@login_required
def auth_user():
    return jsonify({
        'user_id': current_user.id,
        'email': current_user.email,
        'username': current_user.username,
        'icone_url': current_user.icone_url,
    }), 200

# Validar token_admin
@app.route('/api/auth/admin', methods=['GET'])
@login_required
@admin_required
def auth_admin():
    return '', 200

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

# Alterar Icone
@app.route('/api/register/icon', methods=['PUT'])
@login_required
def alterar_icone():
    icon = request.get_json()['icone_url']
    current_user.icone_url = icon
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
# Retornar biblioteca (Jogos) do usuário
@app.route('/api/catalog', methods=['GET'])
@login_required
def meu_catalogo():
    pesquisa = (
        db.select(
            Jogos.id,
            Jogos.name,
            Jogos.name_slug,
            Jogos.capa_url,
            Jogos.ano,
            Avaliacoes.nota,
            Avaliacoes.resenha,
            Usuarios_Jogos.status
            )
            .select_from(Usuarios_Jogos)
            .join(Jogos, Usuarios_Jogos.jogo_id == Jogos.id)
            .join(Avaliacoes, (Avaliacoes.jogo_id == Jogos.id) & (Avaliacoes.usuario_id == current_user.id), isouter=True)
            .filter(Usuarios_Jogos.usuario_id == current_user.id)
    )
    jogos_user = db.session.execute(pesquisa).all()

    catalogo = [
        {
            'id': row.id,
            'name': row.name,
            'name_slug': row.name_slug,
            'capa_url': row.capa_url,
            'ano': row.ano,
            'nota': row.nota,
            'review': row.resenha,
            'status': row.status
        }
        for row in jogos_user
    ]

    return jsonify(catalogo), 200

# Retorna False ou dados do jogo (Se há ou não jogo na biblioteca do usuário)
@app.route('/api/catalog/<jogo_id>')
@login_required
def jogo_catalogo(jogo_id):
    try:
        jogo = db.session.execute(db.select(Usuarios_Jogos)\
        .filter(Usuarios_Jogos.jogo_id == jogo_id, Usuarios_Jogos.usuario_id == current_user.id))\
        .scalar_one()
    except:
        return jsonify({'status': False}), 200
    
    return jsonify(jogo.to_dict()), 200

# Adicionar Jogo a biblioteca
@app.route('/api/catalog/add', methods=['POST'])
@login_required
def add_jogo_catalogo():
    id_usuario = current_user.id
    id_jogo = request.get_json()['id_jogo']
    try:
        adicionar = Usuarios_Jogos(jogo_id=id_jogo, usuario_id=id_usuario)
        db.session.add(adicionar)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Jogo já cadastrado.'), 409
    return jsonify({
        'id_usuario': id_usuario,
        'id_jogo': id_jogo
    }), 200

# Alterar Status Jogo da biblioteca usuario
@app.route('/api/catalog/<int:jogo_id>', methods=['PUT'])
@login_required
def change_status(jogo_id):
    new_status = request.get_json()['new_status']
    jogo = db.session.query(Usuarios_Jogos)\
        .join(Jogos, Usuarios_Jogos.jogo_id == Jogos.id)\
        .filter(Usuarios_Jogos.jogo_id == jogo_id, Usuarios_Jogos.usuario_id == current_user.id)\
        .first()
    if jogo.status == new_status:
        return jsonify('Status igual ao atual.'), 409
    jogo.status = new_status
    db.session.commit()

    return jsonify({
        'mensagem': 'Status atualizado com sucesso!',
    }), 200

# Excluir jogo da coleção
@app.route('/api/catalog/<int:jogo_id>', methods=['DELETE'])
@login_required
def delete_game_collection(jogo_id):
    try:
        game_collection = db.session.query(Usuarios_Jogos).filter_by(
            jogo_id=jogo_id, 
            usuario_id=current_user.id
        ).first()

        avaliacao = db.session.execute(
            db.select(Avaliacoes).filter_by(jogo_id=jogo_id, usuario_id=current_user.id)
        ).scalar_one_or_none()

        if not game_collection and not avaliacao:
            return jsonify({'Jogo ou avaliação não encontrados na sua biblioteca.'}), 404
        if game_collection:
            db.session.delete(game_collection)
        if avaliacao:
            db.session.delete(avaliacao)

        db.session.commit()
        return jsonify({'Jogo e avaliação removidos com sucesso!'}), 200

    except:
        db.session.rollback()
        return jsonify({'error': 'Erro ao remover do catálogo.'}), 500

# Valida e retorna avaliacao do usuario para um jogo
@app.route('/api/catalog/avaliacao/<int:jogo_id>', methods=['GET'])
@login_required
def get_avaliacao_user(jogo_id):
    try:
        avaliacao = db.session.execute(db.select(Avaliacoes)\
            .filter(Avaliacoes.jogo_id == jogo_id, Avaliacoes.usuario_id == current_user.id))\
            .scalar_one()
    except:
        return jsonify({'status': False}), 200
    
    return jsonify(avaliacao.to_dict()), 200

# Adiciona ou altera avaliação do usuario em um jogo
@app.route('/api/catalog/avaliacao/<int:jogo_id>', methods=['POST'])
@login_required
def post_avaliacao_user(jogo_id):
    dados = request.get_json()['dados_avaliacao']

    if dados['nota'] == '':
        dados['nota'] = None 

    avaliacao = Avaliacoes.query.filter_by(
        usuario_id=current_user.id,
        jogo_id=jogo_id
    ).first()

    if avaliacao:
        avaliacao.nota = dados.get('nota')
        avaliacao.resenha = dados.get('review')
    else:
        avaliacao = Avaliacoes(
            usuario_id=current_user.id,
            jogo_id=jogo_id,
            nota=dados.get('nota'),
            resenha=dados.get('review')
        )
        db.session.add(avaliacao)

    db.session.commit()
    return jsonify(avaliacao.to_dict()), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')