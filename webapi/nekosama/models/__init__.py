from flask_migrate import Migrate

from .base import db, ma


def init_app(app):
    db.init_app(app)
    Migrate(app, db)
    ma.init_app(app)
