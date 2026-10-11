from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Games_Tags, Developers
from flask_login import login_required
from app.utils.decorators import admin_required

games_bp = Blueprint('games', __name__, url_prefix='/api/games')

# Obter games
@games_bp.route('/', methods=['GET'])
def list_games():
    games = db.session.scalars(db.select(Games)).all()
    games_dict = [u.to_dict() for u in games]
    return jsonify(games_dict), 200

# Obter games via search (query string)
@games_bp.route('/search', methods=['GET'])
def list_games_search():
    term = request.args.get('q', '').strip()
    page = request.args.get('page', default=1, type=int)

    games = db.select(Games)

    if term:
        games = games.where(Games.name.ilike(f'%{term}%'))

    pagination = db.paginate(
            select=games,
            page=page,
            per_page=8,
            error_out=False
        )
    games_dict = [j.to_dict() for j in pagination.items]

    return jsonify({
        'games': games_dict,
        'total_paginas': pagination.pages
    }), 200

# Obter game via slug
@games_bp.route('/<name_slug>', methods=['GET'])
def listar_jogo(name_slug):
    game = db.one_or_404(db.select(Games).filter_by(name_slug=name_slug))
    game_data = game.to_dict()

    return jsonify(game_data), 200

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
    for tag in game_date['tags']:
        if tag['language'] == 'eng':
            tags.append(tag['slug'])
    for genre in game_date['genres']:
        tags.append(genre['slug'])
    devs = []
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
            new_dev = Developers(game_id=new_game.id, name=dev)
            db.session.add(new_dev)
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