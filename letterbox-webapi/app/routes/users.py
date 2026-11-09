from flask import Blueprint, jsonify, request
from app import db
from app.models import Games, Games_Users, Reviews, Users
from app.utils.decorators import admin_required

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Retornar users
@users_bp.route('/', methods=['GET'])
@admin_required
def get_info_users():
    page = request.args.get('page', default=1, type=int)

    pagination = Users.query.with_entities(
        Users.id, 
        Users.username, 
        Users.icon_url
    ).paginate(page=page, per_page=12, error_out=False)

    users_dict = [
        {
            "id": u.id,
            "username": u.username,
            "icon_url": u.icon_url
        }
        for u in pagination.items
    ]

    return jsonify({'users': users_dict, 'total_page': pagination.pages}), 200

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
    page = request.args.get('page', default=1, type=int)

    pagination = Reviews.query\
        .join(Games)\
        .join(Users)\
        .filter(Reviews.review.is_not(None), Reviews.review != '')\
        .with_entities(
            Reviews.id,
            Reviews.rate,
            Reviews.review,
            Users.icon_url,
            Users.username,
            Games.cover_url,
            Games.name.label('game_name'),
            Games.name_slug
        )\
        .order_by(Reviews.id.desc())\
        .paginate(page=page, per_page=12, error_out=False)

    reviews_dict = [
        {
            "id": r.id,
            "rate": r.rate,
            "review": r.review,
            "icon_url": r.icon_url,
            "username": r.username,
            "cover_url": r.cover_url,
            "name": r.game_name,
            "name_slug": r.name_slug
        }
        for r in pagination.items
    ]

    return jsonify({'reviews': reviews_dict, 'total_page': pagination.pages}), 200

# Excluir review
@users_bp.route('/reviews/<int:id>', methods=['DELETE'])
@admin_required
def delete_review(id):
    try:
        review = Reviews.query.get(id)
        
        if not review:
            return jsonify({'error': 'Review inexistente.'}), 404
        
        db.session.delete(review)
        db.session.commit()

        return jsonify({'message': f"Review '{review.id}' foi excluido com sucesso."}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'Erro ao excluir review no banco de dados.'}), 500