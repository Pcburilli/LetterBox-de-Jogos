from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Games_Tags, Games_Developers, Games_Genres, Reviews, Games_Users
from flask_login import login_required
from app.utils.decorators import admin_required
from sqlalchemy import func, case

games_bp = Blueprint('games', __name__, url_prefix='/api/games')

# Obter games
@games_bp.route('/', methods=['GET'])
def get_games():
    games = db.session.scalars(db.select(Games)).all()
    games_dict = [u.to_dict() for u in games]
    return jsonify(games_dict), 200

# Obter games via search (query string)
@games_bp.route('/search', methods=['GET'])
def get_games_search():
    term = request.args.get('q', '').strip()
    page = request.args.get('page', default=1, type=int)

    games = db.select(Games)

    if term:
        games = games.where(Games.name.ilike(f'%{term}%'))

    pagination = db.paginate(
            select=games,
            page=page,
            per_page=12,
            error_out=False
        )
    games_dict = [j.to_dict() for j in pagination.items]

    return jsonify({
        'games': games_dict,
        'total_paginas': pagination.pages
    }), 200

# Obter via filters (genres, tags, developers...)
@games_bp.route('/filters', methods=['GET'])
def get_games_filters():
    page = request.args.get('page', default=1, type=int)

    genres_param = request.args.getlist('genres')
    tags_param = request.args.getlist('tags')
    dev_param = request.args.get('developer', default='').strip()

    games = db.select(Games)
    if genres_param:
        for genre_param in genres_param:
            genre_clean = genre_param.strip()
            if genre_clean:
                games = games.where(Games.genres.any(Games_Genres.genre.ilike(f'%{genre_clean}%')))
    if tags_param:
        for tag_param in tags_param:
            tag_clean = tag_param.strip()
            if tag_clean:
                games = games.where(Games.tags.any(Games_Tags.tag.ilike(f'%{tag_clean}%')))
    if dev_param:
        games = games.where(Games.developers.any(Games_Developers.name.ilike(f'%{dev_param}%')))

    pagination = db.paginate(
            select=games,
            page=page,
            per_page=12,
            error_out=False
        )
    games_dict = [j.to_dict() for j in pagination.items]

    return jsonify({
        'games': games_dict,
        'total_page': pagination.pages
    }), 200

# Obter game via slug
@games_bp.route('/<name_slug>', methods=['GET'])
def get_game(name_slug):
    game = db.one_or_404(db.select(Games).filter_by(name_slug=name_slug))
    game_data = game.to_dict()

    return jsonify(game_data), 200

# Obter statistic game via slug
@games_bp.route('/<name_slug>/statistics', methods=['GET'])
def get_game_info(name_slug):
    search_reviews = (db.select(
            func.count(Reviews.rate).label('Quantidade_rate'),
            func.coalesce(func.sum(Reviews.rate), 0).label('Soma_rate'),
            func.coalesce(func.round(func.avg(Reviews.rate), 2), 0).label('Media_rate'),
            func.sum(case((Reviews.review != '', 1), else_=0)).label('Quantidade_review')
        )
        .join(Reviews, Games.id == Reviews.game_id)
        .select_from(Games).where(Games.name_slug == name_slug)
    )

    search_users = (
        db.select(
            func.coalesce(func.sum(case((Games_Users.status == 'Na Fila', 1), else_=0)), 0).label('Quantidade_Na_Fila'),
            func.coalesce(func.sum(case((Games_Users.status == 'Jogando', 1), else_=0)), 0).label('Quantidade_Jogando'),
            func.coalesce(func.sum(case((Games_Users.status == 'Zerado', 1), else_=0)), 0).label('Quantidade_Zerado'),
            func.coalesce(func.sum(case((Games_Users.status == 'Abandonado', 1), else_=0)), 0).label('Quantidade_Abandonado')
        )
        .join(Games, Games.id == Games_Users.game_id)
        .where(Games.name_slug == name_slug)
    )

    reviews_data = db.session.execute(search_reviews).first()
    users_data = db.session.execute(search_users).first()

    return jsonify({
        "media_rate": float(reviews_data.Media_rate) if reviews_data else 0.0,
        "quantity_review": reviews_data.Quantidade_review if reviews_data else 0,
        "na_fila": users_data.Quantidade_Na_Fila if users_data else 0,
        "jogando": users_data.Quantidade_Jogando if users_data else 0,
        "zerado": users_data.Quantidade_Zerado if users_data else 0,
        "abandonado": users_data.Quantidade_Abandonado if users_data else 0
    }), 200

# Obter genres 
@games_bp.route('genres', methods=['GET'])
def get_genres():
    genres = db.session.scalars(db.select(Games_Genres.genre).distinct()).all()
    return jsonify(genres), 200

# Obter tags
@games_bp.route('tags', methods=['GET'])
def get_tags():
    tags = db.session.scalars(db.select(Games_Tags.tag).distinct()).all()
    return jsonify(tags), 200

# Obter devs
@games_bp.route('developers', methods=['GET'])
def get_devs():
    devs = db.session.scalars(db.select(Games_Developers.name).distinct()).all()
    return jsonify(devs), 200

# Adicionar game
@games_bp.route('/', methods=['POST'])
@login_required
@admin_required
def add_game():
    game_date = request.get_json()
    name = game_date['name'].strip()
    name_slug = name.lower().replace(' ', '-')
    year = game_date['released']
    cover_url = game_date['background_image']
    description = game_date['description']
    tags = []
    genres = []
    devs = []
    for tag in game_date['tags']:
        if tag['language'] == 'eng':
            tags.append(tag['slug'])
    for genre in game_date['genres']:
        genres.append(genre['slug'])
    for developer in game_date['developers']:
        devs.append(developer['slug'])

    try:
        # Adicionando informações na tabela games
        new_game = Games(name=name, name_slug=name_slug, year=year, cover_url=cover_url, description=description)
        db.session.add(new_game)
        db.session.flush() # Usando flush pq ele não finaliza a ação (como o commit)

        # Adicionando TAGS do jogo na tabela Tags_jogos
        for tag in tags:
            new_tag = Games_Tags(game_id=new_game.id, tag=tag)
            db.session.add(new_tag)

        # Adicionando Desenvolvedor na tabela Developers
        for dev in devs:
            new_dev = Games_Developers(game_id=new_game.id, name=dev)
            db.session.add(new_dev)

        for genre in genres:
            new_genre = Games_Genres(game_id=new_game.id, genre=genre)
            db.session.add(new_genre)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao adicionar jogo: {str(e)}'}), 500
    return jsonify('Cadastro do jogo realizado.'), 200

# Excluir game
@games_bp.route('/<id>', methods=['DELETE'])
@login_required
@admin_required
def delete_game(id):
    game = db.get_or_404(Games, id)
    game_data = game.to_dict()
    db.session.delete(game)
    db.session.commit()
    return jsonify(game_data), 200