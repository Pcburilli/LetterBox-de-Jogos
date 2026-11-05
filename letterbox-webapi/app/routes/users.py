from flask import Blueprint, jsonify
from app import db
from app.models import Games, Games_Users, Reviews, Users
from app.utils.decorators import admin_required

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Retornar users
@users_bp.route('/', methods=['GET'])
@admin_required
def get_info_users():
    users_search = db.select(Users.id, Users.username, Users.icon_url)
    users_data = db.session.execute(users_search).mappings().all()
    users_dict = [dict(u) for u in users_data]

    return jsonify({'users': users_dict}), 200

# Retornar catalog e dados do user (não sensiveis)
@users_bp.route('/<username>', methods=['GET'])
def get_info_user(username):
    username = username.lower().strip()
    user_search = db.select(Users.id, Users.username, Users.icon_url).where(Users.username == username)
    user_data = db.session.execute(user_search).first()
    if (user_data):
        user_id = user_data[0]
        user_icon_url = user_data[2]
    else:
        return jsonify({'error': 'usuário não existente.'}), 404

    search = (
        db.select(
            Games.id,
            Games.name,
            Games.name_slug,
            Games.cover_url,
            Games.year,
            Reviews.rate,
            Reviews.review,
            Games_Users.status
            )
            .select_from(Games_Users)
            .join(Games, Games_Users.game_id == Games.id)
            .join(Reviews, (Reviews.game_id == Games.id) & 
            (Reviews.user_id == user_id), isouter=True)
            .filter(Games_Users.user_id == user_id)
    )
    user_catalog = db.session.execute(search).mappings().all()
    catalog_dict = [dict(r) for r in user_catalog]

    return jsonify({'catalog': catalog_dict, 'user': {'username': username, 'icon_url': user_icon_url}}), 200

# Excluir user
@users_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_user(id):
    try:
        user = Users.query.get(id)
        
        if not user:
            return jsonify({'error': 'Usuário inexistente.'}), 404
    
        if getattr(user, 'is_admin', False):
            return jsonify({'error': 'Usuário é admin.'}), 403
        
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': f"Usuário '{user.username}' (id:{user.id}) foi excluido com sucesso."}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'Erro ao excluir usuário no banco de dados.'}), 500


# Retornar reviews
@users_bp.route('/reviews', methods=['GET'])
@admin_required
def get_info_reviews():
    reviews_search = db.select(Reviews.id, Reviews.rate, Reviews.review, Users.icon_url, Users.username, Games.cover_url, Games.name, Games.name_slug)\
            .where(Reviews.review.is_not(None), Reviews.review != '')\
            .join(Games)\
            .join(Users)\
            .order_by(Reviews.id.desc())
    result_reviews = db.session.execute(reviews_search).mappings().all()
    reviews_dict = [dict(r) for r in result_reviews]

    return jsonify({'reviews': reviews_dict}), 200