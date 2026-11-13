from flask import Blueprint, request, jsonify
from app import db
from app.models import Games, Reviews, Games_Users, Genres
from flask_login import login_required
from app.utils.decorators import admin_required
from sqlalchemy import func, case

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/', methods=['GET'])
@login_required
@admin_required
def get_dashboard():
    # 1. Total geral de jogos cadastrados
    total_games = db.session.scalar(db.select(func.count(Games.id))) or 0

    # 2. Quantidade de jogos por gênero
    genres_query = (
        db.select(Genres.name, func.count(Games.id).label('qtd'))
        .outerjoin(Genres.games)
        .group_by(Genres.id, Genres.name)
        .order_by(Genres.name)
    )
    generos_res = db.session.execute(genres_query).all()
    generos_dict = {row.name: row.qtd for row in generos_res}

    # 3. Estatísticas de Reviews (com nota, média geral, com texto vs apenas nota)
    reviews_stats = db.session.execute(
        db.select(
            func.count(Reviews.rate).label('qtd_reviews'),
            func.avg(Reviews.rate).label('media_geral'),
            func.sum(
                case(
                    (
                        Reviews.review.is_not(None)
                        & (func.trim(Reviews.review) != ''),
                        1,
                    ),
                    else_=0,
                )
            ).label('reviews_com_texto'),
            func.sum(
                case(
                    (
                        Reviews.rate.is_not(None)
                        & (
                            Reviews.review.is_(None)
                            | (func.trim(Reviews.review) == '')
                        ),
                        1,
                    ),
                    else_=0,
                )
            ).label('reviews_apenas_nota'),
        )
    ).one()

    qtd_reviews = reviews_stats.qtd_reviews or 0
    media_geral = (
        round(float(reviews_stats.media_geral), 2)
        if reviews_stats.media_geral is not None
        else 0.0
    )
    reviews_com_texto = int(reviews_stats.reviews_com_texto or 0)
    reviews_apenas_nota = int(reviews_stats.reviews_apenas_nota or 0)

    # 4. Nota média apenas dos jogos que possuem avaliações com nota
    games_avg_query = (
        db.select(
            Games.id,
            Games.name,
            Games.name_slug,
            func.avg(Reviews.rate).label('media_nota'),
            func.count(Reviews.rate).label('qtd_avaliacoes'),
        )
        .join(Games.reviews)
        .where(Reviews.rate.is_not(None))
        .group_by(Games.id, Games.name)
        .order_by(func.avg(Reviews.rate).desc(), Games.name)
    )
    games_avg_res = db.session.execute(games_avg_query).all()

    medias_por_jogo = [
        {
            'id': row.id,
            'name': row.name,
            'name_slug': row.name_slug,
            'media_nota': round(float(row.media_nota), 2),
            'qtd_avaliacoes': row.qtd_avaliacoes,
        }
        for row in games_avg_res
    ]

    # 5. Jogos nas bibliotecas dos usuários (total e por status)
    status_query = (
        db.select(Games_Users.status, func.count().label('qtd'))
        .where(Games_Users.status.is_not(None))
        .group_by(Games_Users.status)
    )
    status_res = db.session.execute(status_query).all()

    qtd_por_status = {
        'Na Fila': 0,
        'Jogando': 0,
        'Zerado': 0,
        'Abandonado': 0,
    }
    for row in status_res:
        if row.status in qtd_por_status:
            qtd_por_status[row.status] = row.qtd

    total_jogos_biblioteca = sum(qtd_por_status.values())

    # 6. Evolução temporal: jogos adicionados às bibliotecas por mês (últimos 12 meses)
    ano_expr = func.extract('year', Games_Users.creation_date).label('ano')
    mes_expr = func.extract('month', Games_Users.creation_date).label('mes')

    evolucao_query = (
        db.select(ano_expr, mes_expr, func.count().label('qtd'))
        .where(Games_Users.creation_date.is_not(None))
        .group_by(ano_expr, mes_expr)
        .order_by(ano_expr.desc(), mes_expr.desc())
        .limit(12)
    )
    evolucao_res = db.session.execute(evolucao_query).all()

    # Inverte para ordem cronológica (do mês mais antigo ao mais recente) para o gráfico
    evolucao_mensal = [
        {
            'mes': f'{int(row.ano)}-{int(row.mes):02d}',
            'qtd': row.qtd,
        }
        for row in reversed(evolucao_res)
    ]

    return (
        jsonify({
            'qtd_games': total_games,
            'generos': generos_dict,
            'qtd_reviews': qtd_reviews,
            'media_geral': media_geral,
            'detalhes_reviews': {
                'com_texto': reviews_com_texto,
                'apenas_nota': reviews_apenas_nota,
            },
            'medias_por_jogo': medias_por_jogo,
            'qtd_jogos_biblioteca': total_jogos_biblioteca,
            'status': qtd_por_status,
            'evolucao_biblioteca_mensal': evolucao_mensal,
        }),
        200,
    )