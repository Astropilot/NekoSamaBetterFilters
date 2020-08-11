import click
from flask.cli import with_appcontext
from flask_migrate import Migrate

from .base import db, ma
from .anime import AnimeGenre


GENRES = {
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Hentai',
    'Horror',
    'Mahou Shoujo',
    'Mecha',
    'Music',
    'Mystery',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller'
}


@click.command('populate-genres')
@with_appcontext
def populate_genres():
    for g in GENRES:
        genre = AnimeGenre(name=g)
        db.session.add(genre)
    db.session.commit()
    click.echo('Database populated!')


def init_app(app):
    db.init_app(app)
    Migrate(app, db)
    ma.init_app(app)
    app.cli.add_command(populate_genres)
