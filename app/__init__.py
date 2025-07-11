from flask import Flask
from .config import Config
from .db.db import db
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
  
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    


    from app.routes.expenses_routes import expense_bp
    app.register_blueprint(expense_bp)


    CORS(app)
    return app