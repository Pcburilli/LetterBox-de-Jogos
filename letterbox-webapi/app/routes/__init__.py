from app.routes.games import games_bp
from app.routes.auth import auth_bp
from app.routes.catalog import catalog_bp
from app.routes.index import index_bp
from app.routes.user import users_bp

__all__ = ['games_bp', 'auth_bp', 'catalog_bp', 'index_bp', 'users_bp']