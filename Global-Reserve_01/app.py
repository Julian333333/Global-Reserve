from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import and register blueprints
    from routes.auth_routes import auth_bp
    from routes.trading_routes import trading_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(trading_bp, url_prefix='/trading')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
