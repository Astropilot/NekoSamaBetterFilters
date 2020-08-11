import click
import requests
from flask.cli import with_appcontext

from .models.base import db
from .models.anime import Anime, AnimeGenre


EXCLUDE_GENRE_ATTR = {
    'id',
    'title',
    'title_english',
    'title_romanji',
    'others',
    'type',
    'status',
    'popularity',
    'url',
    'url_image',
    'score',
    'start_date_year',
    'nb_eps'
}


@click.command('populate-animes')
@with_appcontext
def populate_animes():
    r = requests.get('https://www.neko-sama.fr/animes-search.json?gkeorgkeogkccc')
    animes = r.json()

    for a in animes:
        attributes = [x for x in a.keys() if x not in EXCLUDE_GENRE_ATTR]
        genres = AnimeGenre.query.filter(AnimeGenre.name.in_(attributes)).all()

        try:
            start_date_year = int(a['start_date_year'])
        except ValueError:
            start_date_year = None

        anime = Anime(
            id=a['id'],
            title=a['title'],
            title_english=a['title_english'],
            title_romanji=a['title_romanji'],
            others=a['others'],
            type=a['type'],
            status=int(a['status']),
            popularity=a['popularity'],
            url=a['url'],
            url_image=a['url_image'],
            score=float(a['score']),
            start_date_year=start_date_year,
            nb_eps=a['nb_eps'],
            genres=genres
        )

        db.session.add(anime)

    db.session.commit()
    click.echo('Database populated!')
