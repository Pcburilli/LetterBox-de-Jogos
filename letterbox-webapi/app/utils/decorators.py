from functools import wraps
from flask import jsonify
from flask_login import current_user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Verifica se está logado E se o campo is_admin é True
        if not current_user.is_authenticated or not getattr(current_user, 'is_admin', False):
            return jsonify({'erro': 'Acesso negado. Requer privilégios de administrador.'}), 403
        return f(*args, **kwargs)
    return decorated_function