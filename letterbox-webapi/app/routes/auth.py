from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models import Users
from flask_login import login_user, logout_user, login_required, current_user
from app.utils.decorators import admin_required
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data_user = request.get_json()
    print('DADOS:', data_user)
    email = data_user['email'].lower().strip()
    password = data_user['password']

    user = db.session.scalars(db.select(Users).filter_by(email=email)).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({
            'mensagem': 'Login realizado com sucesso!',
            'usuario': user.to_dict()
        }), 200
        
    return jsonify('Email ou Senha incorretas'), 401

# Logout
@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'mensagem': 'Logout realizado com sucesso!'}), 200

# Validar token_user
@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'user_id': current_user.id,
        'email': current_user.email,
        'username': current_user.username,
        'icon_url': current_user.icon_url,
    }), 200

# Validar token_admin
@auth_bp.route('/admin', methods=['GET'])
@login_required
@admin_required
def check_admin_access():
    return '', 200

# Registrar usuário
@auth_bp.route('/register', methods=['POST'])
def registrar_usuario():
    data_user = request.get_json()
    email = data_user['email'].lower().strip()
    password = data_user['password']
    password_hash = generate_password_hash(password)

    try:
        new_user = Users(email=email, password=password_hash)
        db.session.add(new_user)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Email ou username já cadastrado.'), 409
    return jsonify('Cadastro realizado.'), 200

# Alterar Username
@auth_bp.route('/register/username', methods=['PUT'])
@login_required
def update_username():
    username = request.get_json()['username'].lower().strip()
    current_user.username = username
    db.session.commit()

    return jsonify({'mensagem': 'Perfil atualizado com sucesso!'}), 200

# Alterar Icone
@auth_bp.route('/register/icon', methods=['PUT'])
@login_required
def update_icon():
    icon = request.get_json()['icon_url']
    current_user.icon_url = icon
    db.session.commit()

    return jsonify({'mensagem': 'Perfil atualizado com sucesso!'}), 200

# Retornar usuários
@auth_bp.route('/usuarios')
@login_required
@admin_required
def get_users():
    users = db.session.scalars(db.select(Users)).all()
    users_dict = [u.to_dict() for u in users]
    print(users_dict)
    return jsonify(users_dict), 200