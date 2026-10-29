from flask import Blueprint, jsonify
from app import db
from app.models import Games, Games_Users, Reviews, Users

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Retornar catalog e dados do user (não sensiveis)
@users_bp.route('/<username>', methods=['GET'])
def get_info_users(username):
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
    