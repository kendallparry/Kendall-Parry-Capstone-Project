import os 
from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    from .routes import main
    app.register_blueprint(main)

    return app