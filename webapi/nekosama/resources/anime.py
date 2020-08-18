import math
from flask import request
from flask_restful import Resource
from elasticsearch_dsl import Q, A

from ..models.anime import Anime, format_anime


SORTING_WHITELIST = {
    'title',
    'start_date_year'
}

DEFAULT_PER_PAGE = 56


class AnimeYearsResource(Resource):
    def get(self):
        a = A(
            'terms',
            field='start_date_year',
            size=100,
            order={"_key": "desc"}
        )
        years = Anime.search()
        years.aggs.bucket('genres', a)
        years = years[:0]

        response = years.execute()

        if response.success():
            years = [genre.key for genre in response.aggregations.genres.buckets]
        else:
            return [], 200

        return years, 200


class AnimeListResource(Resource):
    def get(self):
        data = request.args

        # Pagination
        try:
            page = int(data.get('page', 1))
            if page < 1:
                page = 1
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
            sort_by = 'score_anime'
        if sort_dir != 'asc' and sort_dir != 'desc':
            sort_dir = 'desc'

        animes = Anime.search()

        if search is not None:
            search = search.strip()
            animes = animes.query(
                'multi_match',
                query=search,
                type='bool_prefix',
                operator='AND',
                fields=['title', 'title_english', 'title_romanji', 'others']
            )

        if type is not None:
            animes = animes.filter('term', type=type)

        if status is not None:
            try:
                animes = animes.filter('term', status=int(status))
            except ValueError:
                pass

        if year is not None:
            try:
                animes = animes.filter('term', start_date_year=int(year))
            except ValueError:
                pass

        if len(genres) > 0:
            q = Q('term', genres=genres.pop(0))
            for genre in genres:
                q = q & Q('term', genres=genre)
            animes = animes.query(q)

        if sort_by == 'title':
            sort_by = sort_by + '.keyword'
        animes = animes.sort(
            {sort_by: {'order': sort_dir}},
            '-score_anime',
            '_score'
        )

        animes = animes[(page - 1) * perPage:page * perPage]

        response = animes.execute()

        if response.success() is True:
            animes = [format_anime(a) for a in response]
            total_page = math.ceil(response.hits.total.value / perPage)
            if page > total_page:
                page = total_page
        else:
            animes = []
            total_page = 0
            page = 1

        return {
            'animes': animes,
            'pagination': {'current': page, 'total': total_page}
        }, 200
