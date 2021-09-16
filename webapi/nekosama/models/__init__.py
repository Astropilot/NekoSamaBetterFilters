from .base import db, ma
from .thumbnail import Thumbnail

def init_db():
    db.create_all()
    db.session.commit()

def init_app(app):
    db.init_app(app)
    ma.init_app(app)
