import click
import json
import requests
import traceback
from flask import render_template, current_app
from flask.cli import with_appcontext
from elasticsearch_dsl import Q, connections
from pygments import highlight
from pygments.lexers.data import JsonLexer
from pygments.formatters import HtmlFormatter

from ..models.anime import Anime
from ..mails import send_mail_html

NEKO_ANIME_DB = 'https://neko-sama.fr/animes-search-vostfr.json'

MAIL_IMAGES = [
    {
        'path': 'templates/images/icon_neko.png',
        'mimetype': 'image/png',
        'content_id': 'iconneko'
    },
    {
        'path': 'templates/images/banner.png',
        'mimetype': 'image/png',
        'content_id': 'banner'
    }
]


@click.command('populate-animes')
@with_appcontext
def populate_animes():
    try:
        if not Anime._index.exists():
            Anime.init()

        animes_added = 0
        animes_updated = 0
        animes_deleted = 0

        r = requests.get(NEKO_ANIME_DB)
        print(r.text)
        animes = r.json()

        anime_ids = [str(a['id']) for a in animes]

        search = Anime.search()
        search = search.query('ids', values=anime_ids)

        animes_updated = search.count()
        animes_added = len(animes) - animes_updated

        for a in animes:
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
                genres=a['genres']
            ).save()

        search = Anime.search()
        search = search.query(~Q('ids', values=anime_ids))

        response = search.delete()
        animes_deleted = response.deleted

        click.echo(f'Added {animes_added} animes!')
        click.echo(f'Updated {animes_updated} animes!')
        click.echo(f'Deleted {animes_deleted} animes!')

        if current_app.config['MAIL_ACTIVE_LOGS'] is True:
            cluster_health = connections.get_connection().cluster.health()

            cluster_health = json.dumps(cluster_health, indent=2)

            cluster_health = highlight(
                cluster_health,
                JsonLexer(),
                HtmlFormatter(noclasses=True)
            )

            send_mail_html(
                'Animes Update - Success',
                current_app.config['MAIL_LOGS_RECIPIENT'],
                render_template(
                    'update_db_success.html',
                    animes_added=animes_added,
                    animes_updated=animes_updated,
                    animes_deleted=animes_deleted,
                    cluster_health=cluster_health
                ),
                MAIL_IMAGES
            )
    except Exception as ex:
        if current_app.config['MAIL_ACTIVE_LOGS'] is True:
            stacktrace = '<br>'.join(
                traceback.TracebackException.from_exception(ex).format()
            )

            send_mail_html(
                'Animes Update - Error',
                current_app.config['MAIL_LOGS_RECIPIENT'],
                render_template(
                    'update_db_failure.html',
                    stacktrace=stacktrace
                ),
                MAIL_IMAGES
            )
        raise ex
