import re
from flask import request
from flask_restful import Resource
from sqlalchemy import or_

from ..models.anime import Anime, AnimeGenre, animes_schema


SORTING_WHITELIST = {
    'score',
    'title',
    'start_date_year'
}

DEFAULT_PER_PAGE = 56


class AnimeYearsResource(Resource):
    def get(self):
        years = Anime.query. \
            filter(Anime.start_date_year.isnot(None)). \
            with_entities(Anime.start_date_year). \
            distinct(). \
            order_by(Anime.start_date_year.desc()).all()

        return years, 200


class AnimeListResource(Resource):
    def get(self):
        data = request.args

        # Pagination
        try:
            page = int(data.get('page', 1))
        except ValueError:
            page = 1

        try:
            perPage = int(data.get('perPage', DEFAULT_PER_PAGE))
        except ValueError:
            perPage = DEFAULT_PER_PAGE

        # Filters
        search = data.get('search', None)
        type = data.get('type', None)
        status = data.get('status', None)
        year = data.get('year', None)
        genres = data.getlist('genres')
        sort = data.get('sort', 'score_desc')
        sort_by = '_'.join(sort.split('_')[0:-1])
        sort_dir = sort.split('_')[-1]

        if len(genres) == 1 and ',' in genres[0]:
            genres = genres[0].split(',')

        if sort_by not in SORTING_WHITELIST:
            sort_by = 'score'
        if sort_dir != 'asc' and sort_dir != 'desc':
            sort_dir = 'desc'

        animes = Anime.query

        if search is not None:
            searches = re.split(r'[\s\-]+', search.lower())
            columns = [
                Anime.title,
                Anime.title_english,
                Anime.title_romanji,
                Anime.others
            ]
            search_args = []
            for s in searches:
                search_args.extend([col.ilike(f'%{s}%') for col in columns])
            animes = animes.filter(or_(*search_args))

        if type is not None:
            animes = animes.filter(Anime.type == type)

        if status is not None:
            try:
                animes = animes.filter(Anime.status == int(status))
            except ValueError:
                pass

        if year is not None:
            try:
                animes = animes.filter(Anime.start_date_year == int(year))
            except ValueError:
                pass

        if len(genres) > 0:
            for genre in genres:
                animes = animes.filter(
                    Anime.genres.any(AnimeGenre.name == genre)
                )

        animes = animes.order_by(
            getattr(getattr(Anime, sort_by), sort_dir)(),
            Anime.score.desc(),
            Anime.popularity.desc()
        )
        animes = animes.paginate(page, perPage, error_out=False)

        animes_dump = animes_schema.dump(animes.items)
        return {
            'animes': animes_dump,
            'pagination': {'current': animes.page, 'total': animes.pages}
        }, 200
