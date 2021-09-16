from .base import db

class Thumbnail(db.Model):
    __tablename__ = 'thumbnail'

    id = db.Column(db.Integer, primary_key=True)
    host_hash = db.Column(db.Text(), nullable=False, index=True, unique=True)
    thumbnail_sprite_url = db.Column(db.Text(), nullable=False)
