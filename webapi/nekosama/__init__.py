from flask import Flask, Blueprint
from flask_restful import Api
from flask_cors import CORS
from flask_migrate import Migrate
from elasticsearch_dsl import connections
from flask_mail import Mail

from .commands.populate import populate_animes


def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')

    from . import models
    models.init_app(app)

    from nekosama.models import db
    Migrate(app, db)

    connections.create_connection(
        hosts=[app.config['ELASTICSEARCH_HOST']],
        timeout=30
    )

    if app.config['MAIL_ACTIVE_LOGS'] is True:
        app.mail = Mail(app)

    app.cli.add_command(populate_animes)

    CORS(app, origins='https://neko-sama.fr/*')

    api_bp = Blueprint('api', __name__)
    api = Api(api_bp, catch_all_404s=True)

    from .resources.anime import AnimeListResource, AnimeYearsResource
    from .resources.thumbnails import ThumbnailsResource
    from .resources.episode import LastEpisodeResource

    api.add_resource(AnimeListResource, '/animes')
    api.add_resource(AnimeYearsResource, '/animes/years')
    api.add_resource(ThumbnailsResource, '/thumbnails')
    api.add_resource(LastEpisodeResource, '/episodes/today')

    app.register_blueprint(api_bp, url_prefix='/api')

    try:
        return app
    except:
        pass
