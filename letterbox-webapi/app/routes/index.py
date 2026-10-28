from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Reviews, Users
from sqlalchemy import func

index_bp = Blueprint('index', __name__, url_prefix='/api/index')

@index_bp.route('/', methods=['GET'])
def get_info_index():
    # Retornando os últimos 15 jogos adicionados/cadastrados
    stmt_games = db.select(Games.name, Games.name_slug, Games.cover_url).order_by(Games.id.desc()).limit(15)
    result_games = db.session.execute(stmt_games).mappings().all()
    games_dict = [dict(g) for g in result_games]

    # Retornando as últimas 10 reviews publicadas
    stmt_reviews = db.select(Reviews.id, Reviews.rate, Reviews.review, Users.icon_url, Users.username, Games.cover_url, Games.name, Games.name_slug)\
        .where(Reviews.review.is_not(None), Reviews.review != '')\
        .join(Games)\
        .join(Users)\
        .order_by(Reviews.id.desc()).limit(10)
    result_reviews = db.session.execute(stmt_reviews).mappings().all()
    reviews_dict = [dict(r) for r in result_reviews]
    
    # Jogo aleátorio, porém necessário mudar lógica no futuro, visto que quanto mais jogo mais lento fica...
    stmt_game_random = (db.select(Games.name, Games.name_slug, Games.cover_url).order_by(func.random()).limit(1))
    result_game_random = db.session.execute(stmt_game_random).mappings().first()
    random_dict = dict(result_game_random) if result_game_random else None
    
    return jsonify({'games': games_dict, 'reviews': reviews_dict, 'game_random': random_dict}), 200