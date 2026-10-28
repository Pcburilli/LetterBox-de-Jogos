from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Reviews, Games_Users, Tags, Developers, Genres
from flask_login import login_required
from app.utils.decorators import admin_required
from sqlalchemy import func, case

games_bp = Blueprint('games', __name__, url_prefix='/api/games')

# Obter games
@games_bp.route('/', methods=['GET'])
@login_required
@admin_required
def get_games():
    games = Games.query.order_by(Games.id).all()
    games_dict = [u.to_dict() for u in games]
    return jsonify(games_dict), 200

# Obter games via search (query string)
@games_bp.route('/search', methods=['GET'])
def get_games_search():
    term = request.args.get('q', '').strip()
    page = request.args.get('page', default=1, type=int)

    games = db.select(Games).order_by(Games.id)

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
        'total_page': pagination.pages
    }), 200

# Obter via filters (genres, tags, developers...)
@games_bp.route('/filters', methods=['GET'])
def get_games_filters():
    page = request.args.get('page', default=1, type=int)

    genres_param = request.args.getlist('genres')
    tags_param = request.args.getlist('tags')
    dev_param = request.args.get('developer', default='').strip()

    games = db.select(Games).order_by(Games.id)
    if genres_param:
        for genre_param in genres_param:
            genre_clean = genre_param.strip()
            if genre_clean:
                games = games.join(Games.genres).where(Genres.name.ilike(f'%{genre_clean}%'))
    if tags_param:
        for tag_param in tags_param:
            tag_clean = tag_param.strip()
            if tag_clean:
                games = games.join(Games.tags).where(Tags.name.ilike(f'%{tag_clean}%'))
    if dev_param:
        games = games.where(Games.developers).where(Developers.name.ilike(f'%{dev_param}%'))

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
    genres = db.session.scalars(db.select(Genres.name)).all()
    return jsonify(genres), 200

# Obter tags
@games_bp.route('tags', methods=['GET'])
def get_tags():
    tags = db.session.scalars(db.select(Tags.name)).all()
    return jsonify(tags), 200

# Obter devs
@games_bp.route('developers', methods=['GET'])
def get_devs():
    devs = db.session.scalars(db.select(Developers.name)).all()
    return jsonify(devs), 200

# Adicionar game
@games_bp.route('/', methods=['POST'])
@login_required
@admin_required
def add_game():
    game_data = request.get_json() or {}
    
    if game_data.get('source') not in ['rawg', 'api']:
        return jsonify({'error': 'Source inválido ou ausente.'}), 422

    name = game_data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'O nome do jogo é obrigatório.'}), 400

    name_slug = name.lower().replace(' ', '-')
    year = game_data.get('released')
    description = game_data.get('description', '')
    cover_url = None

    tags, genres, devs = [], [], []

    if game_data['source'] == 'rawg':
        cover_url = game_data.get('background_image')
        
        tags = [
            tag['slug'] 
            for tag in game_data.get('tags', []) 
            if tag.get('language') == 'eng' and 'slug' in tag
        ]
        genres = [genre['slug'] for genre in game_data.get('genres', []) if 'slug' in genre]
        devs = [dev['slug'] for dev in game_data.get('developers', []) if 'slug' in dev]
    else:
        cover_url = game_data.get('cover_url')
        tags = game_data.get('tags', [])
        genres = game_data.get('genres', [])
        devs = game_data.get('developers', [])

    try:
        new_game = Games(
            name=name, 
            name_slug=name_slug, 
            year=year, 
            cover_url=cover_url, 
            description=description
        )
        try:
            db.session.add(new_game)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Jogo já cadastrado.'}), 409

        for tag_name in tags:
            tag_obj = Tags.query.filter_by(name=tag_name).first()
            if not tag_obj:
                tag_obj = Tags(name=tag_name)
            new_game.tags.append(tag_obj)

        for dev_name in devs:
            dev_obj = Developers.query.filter_by(name=dev_name).first()
            if not dev_obj:
                dev_obj = Developers(name=dev_name)
            new_game.developers.append(dev_obj)

        for genre_name in genres:
            genre_obj = Genres.query.filter_by(name=genre_name).first()
            if not genre_obj:
                genre_obj = Genres(name=genre_name)
            new_game.genres.append(genre_obj)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao adicionar jogo: {str(e)}'}), 500

    return jsonify({'message': 'Jogo registrado com sucesso!'}), 201

# Excluir game
@games_bp.route('/<id>', methods=['DELETE'])
@login_required
@admin_required
def delete_game(id):
    game = Games.query.filter_by(id=id).first_or_404()
    game_data = game.to_dict()
    db.session.delete(game)
    db.session.commit()
    return jsonify(game_data), 200

# Alterar infos game
@games_bp.route('/<id>', methods=['PATCH'])
@login_required
@admin_required
def patch_game(id):
    data = request.get_json() or {}
    game = Games.query.filter_by(id=id).first_or_404()

    if 'name' in data:
        game.name = data['name'].strip()
        game.name_slug = data['name'].strip().lower().replace(' ', '-')
    if 'year' in data:
        game.year = data['year']
    if 'description' in data:
        game.description = data['description'].strip()
    if 'genres' in data:
        new_genres = []
        for genre in data['genres']:
            genre_obj = Genres.query.filter_by(name=genre).first()
            if not genre_obj:
                genre_obj = Genres(name=genre)
            new_genres.append(genre_obj)       
        game.genres = new_genres
    if 'developers' in data:
        new_devs = []
        for dev in data['developers']:
            dev_obj = Developers.query.filter_by(name=dev).first()
            if not dev_obj:
                dev_obj = Developers(name=dev)
            new_devs.append(dev_obj)       
        game.developers = new_devs
    if 'tags' in data:
        new_tags = []
        for tag in data['tags']:
            tag_obj = Tags.query.filter_by(name=tag).first()
            if not tag_obj:
                tag_obj = Tags(name=tag)
            new_tags.append(tag_obj)    
        game.tags = new_tags

    try:
        db.session.commit()
        return jsonify({'message': 'Jogo atualizado com sucesso!', 'game': game.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao atualizar: {str(e)}'}), 500