import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from dotenv import load_dotenv

# carregar arquivo .env
load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.getenv('PASSWORD')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') # Utilizando PostgreSQL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"]) # Suporte a comunicação em um unico PC e adicionado suporte ao envio de cookies para o front-end

    login_manager.init_app(app)

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'mensagem': 'Acesso negado. Faça login para continuar.'}), 401
    

    # registrar rotas da Blueprints no Flask
    from app.routes.games import games_bp
    from app.routes.auth import auth_bp
    from app.routes.catalog import catalog_bp 

    app.register_blueprint(games_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(catalog_bp)

    return app

