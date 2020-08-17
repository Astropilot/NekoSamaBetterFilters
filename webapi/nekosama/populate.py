import click
import requests
from flask.cli import with_appcontext

# from .models.base import db
from .models.anime import Anime


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


@click.command('populate-animes')
@with_appcontext
def populate_animes():
    if not Anime._index.exists():
        Anime.init()

    r = requests.get('https://www.neko-sama.fr/animes-search.json?gkeorgkeogkccc')
    animes = r.json()

    for a in animes:
        genres = [x for x in a.keys() if x in GENRES]
        try:
            start_date_year = int(a['start_date_year'])
        except ValueError:
            start_date_year = None

        Anime(
            _id=a['id'],
            title=a['title'],
            title_english=a['title_english'],
            title_romanji=a['title_romanji'],
            others=a['others'],
            type=a['type'],
            status=int(a['status']),
            url=a['url'],
            url_image=a['url_image'],
            score_anime=float(a['score']),
            start_date_year=start_date_year,
            nb_eps=a['nb_eps'],
            genres=genres
        ).save()

    click.echo('Finished!')
