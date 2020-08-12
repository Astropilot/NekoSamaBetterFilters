import os
# from flask_apscheduler import APScheduler
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from .populate import populate_genres, populate_animes
# scheduler = APScheduler()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    try:
        os.makedirs(app.config['DATABASE_FOLDER'])
    except OSError:
        pass

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

    # scheduler.init_app(app)
    # scheduler.start()

    try:
        return app
    except:
        pass
        # scheduler.shutdown()
