from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from .populate import populate_genres, populate_animes


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from . import models
    models.init_app(app)

    app.cli.add_command(populate_animes)
    app.cli.add_command(populate_genres)

    CORS(app, origins='https://www.neko-sama.fr/*')

    from .api import api_bp
    api = Api(api_bp, catch_all_404s=True)

    from .resources.anime import AnimeListResource

    api.add_resource(AnimeListResource, '/animes')

    app.register_blueprint(api_bp, url_prefix='/api')

    return app
