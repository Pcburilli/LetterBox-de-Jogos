from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Games_Users, Reviews
from flask_login import login_required, current_user

catalog_bp = Blueprint('catalog', __name__, url_prefix='/api/catalog')

# Retornar biblioteca (Jogos) do usuário
@catalog_bp.route('/', methods=['GET'])
@login_required
def catalog_user():
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
            .join(Reviews, (Reviews.game_id == Games.id) & (Reviews.user_id == current_user.id), isouter=True)
            .filter(Games_Users.user_id == current_user.id)
    )
    user_games = db.session.execute(search).all()

    catalog = [
        {
            'id': row.id,
            'name': row.name,
            'name_slug': row.name_slug,
            'cover_url': row.cover_url,
            'year': row.year,
            'rate': row.rate,
            'review': row.review,
            'status': row.status
        }
        for row in user_games
    ]

    return jsonify(catalog), 200

# Retorna False ou dados do jogo (Se há ou não jogo na biblioteca do usuário)
@catalog_bp.route('/<game_id>')
@login_required
def catalog_game(game_id):
    try:
        game = db.session.execute(db.select(Games_Users)\
        .filter(Games_Users.game_id == game_id, Games_Users.user_id == current_user.id))\
        .scalar_one()
    except:
        return jsonify({'status': False}), 200
    
    return jsonify(game.to_dict()), 200

# Adicionar Jogo a biblioteca
@catalog_bp.route('/add', methods=['POST'])
@login_required
def add_game_catalog():
    user_id = current_user.id
    game_id = request.get_json()['game_id']
    try:
        game = Games_Users(game_id=game_id, user_id=user_id)
        db.session.add(game)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify('Jogo já cadastrado.'), 409
    return jsonify({
        'user_id': user_id,
        'game_id': game_id
    }), 200

# Alterar Status Jogo da biblioteca usuario
@catalog_bp.route('/<int:game_id>', methods=['PUT'])
@login_required
def change_status(game_id):
    new_status = request.get_json()['new_status']
    game = db.session.query(Games_Users)\
        .join(Games, Games_Users.game_id == Games.id)\
        .filter(Games_Users.game_id == game_id, Games_Users.user_id == current_user.id)\
        .first()
    if game.status == new_status:
        return jsonify('Status igual ao atual.'), 409
    game.status = new_status
    db.session.commit()

    return jsonify({
        'mensagem': 'Status atualizado com sucesso!',
    }), 200

# Excluir jogo da coleção
@catalog_bp.route('/<int:game_id>', methods=['DELETE'])
@login_required
def delete_game_catalog(game_id):
    try:
        catalog_game = db.session.query(Games_Users).filter_by(
            game_id=game_id, 
            user_id=current_user.id
        ).first()

        rating = db.session.execute(
            db.select(Reviews).filter_by(game_id=game_id, user_id=current_user.id)
        ).scalar_one_or_none()

        if not catalog_game and not rating:
            return jsonify({'Jogo ou avaliação não encontrados na sua biblioteca.'}), 404
        if catalog_game:
            db.session.delete(catalog_game)
        if rating:
            db.session.delete(rating)

        db.session.commit()
        return jsonify({'Jogo e avaliação removidos com sucesso!'}), 200

    except:
        db.session.rollback()
        return jsonify({'error': 'Erro ao remover do catálogo.'}), 500

# Valida e retorna avaliacao do usuario para um jogo
@catalog_bp.route('/review/<int:game_id>', methods=['GET'])
@login_required
def get_review_user(game_id):
    try:
        review = db.session.execute(db.select(Reviews)\
            .filter(Reviews.game_id == game_id, Reviews.user_id == current_user.id))\
            .scalar_one()
    except:
        return jsonify({'status': False}), 200
    
    return jsonify(review.to_dict()), 200

# Adiciona ou altera avaliação do usuario em um jogo
@catalog_bp.route('/review/<int:game_id>', methods=['POST'])
@login_required
def post_avaliacao_user(game_id):
    data = request.get_json()['review_data']
    print(data)

    if data['nota'] == '':
        data['nota'] = None 

    review = Reviews.query.filter_by(
        user_id=current_user.id,
        game_id=game_id
    ).first()

    if review:
        review.rate = data.get('nota')
        review.review = data.get('review')
    else:
        review = Reviews(
            user_id=current_user.id,
            game_id=game_id,
            rate=data.get('nota'),
            review=data.get('review')
        )
        db.session.add(review)

    db.session.commit()
    return jsonify(review.to_dict()), 200