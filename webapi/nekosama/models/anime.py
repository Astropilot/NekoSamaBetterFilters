from elasticsearch_dsl import Document, Keyword, Text


class Anime(Document):
    title = Text(fields={'keyword': Keyword()})
    title_english = Text()
    title_romanji = Text()
    title_french = Text()
    others = Text()
    type = Keyword()
    status = Keyword()
    url = Keyword()
    url_image = Keyword()
    score_anime = Keyword()
    start_date_year = Keyword()
    nb_eps = Keyword()
    genres = Keyword(multi=True)

    class Index:
        name = 'animes'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}


def format_anime(anime):
    return {
        'title': anime.title,
        'title_english': anime.title_english,
        'title_romanji': anime.title_romanji,
        'title_french': anime.title_french,
        'others': anime.others,
        'type': anime.type,
        'status': anime.status,
        'url': anime.url,
        'url_image': anime.url_image,
        'score': anime.score_anime,
        'start_date_year': anime.start_date_year,
        'nb_eps': anime.nb_eps,
        'genres': [str(g) for g in anime.genres]
    }
