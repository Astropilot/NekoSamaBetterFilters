import re
from flask import request
from flask_restful import Resource
from sqlalchemy import or_, all_

from ..models.anime import Anime, AnimeGenre, animes_schema


class AnimeListResource(Resource):
    def get(self):
        data = request.args

        # Pagination
        page = int(data.get('page', 1))
        perPage = int(data.get('perPage', 56))

        # Filters
        search = data.get('search', None)
        type = data.get('type', None)
        status = data.get('status', None)
        year = data.get('year', None)
        genres = data.getlist('genres', None)
        sort = data.get('sort', 'score_desc')
        sort_by = '_'.join(sort.split('_')[0:-1])
        sort_dir = sort.split('_')[-1]

        animes = Anime.query

        if search is not None:
            searches = re.split(r'[\s\-]+', search.lower())
            columns = [Anime.title, Anime.title_english, Anime.title_romanji, Anime.others]
            search_args = []
            for s in searches:
                search_args.extend([col.like(f'%{s}%') for col in columns])
            animes = animes.filter(or_(*search_args))

        if type is not None:
            animes = animes.filter(Anime.type == type)

        if status is not None:
            animes = animes.filter(Anime.status == int(status))

        if year is not None:
            animes = animes.filter(Anime.start_date_year == int(year))

        if genres is not None:
            print(genres)
            # genres = AnimeGenre.query.filter(AnimeGenre.name.in_(genres))
            animes = animes.join(Anime.genres)
            for genre in genres:
                animes = animes.filter(Anime.genres.any(AnimeGenre.name == genre))
            # animes = animes.filter(Anime.genres.in_(genre))

        animes = animes.order_by(getattr(getattr(Anime, sort_by), sort_dir)())
        animes = animes.paginate(page, perPage, error_out=False)

        animes_dump = animes_schema.dump(animes.items)
        return {
            'animes': animes_dump,
            'pagination': {'current': animes.page, 'total': animes.pages}
        }, 200
