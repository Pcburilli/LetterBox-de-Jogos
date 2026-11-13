from app.routes.games import games_bp
from app.routes.auth import auth_bp
from app.routes.catalog import catalog_bp
from app.routes.index import index_bp
from app.routes.users import users_bp
from app.routes.dashboard import dashboard_bp

__all__ = ['games_bp', 'auth_bp', 'catalog_bp', 'index_bp', 'users_bp', 'dashboard_bp']