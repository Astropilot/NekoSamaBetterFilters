from .base import db, ma


genres = db.Table(
    'genres',
    db.Column(
        'genre_id',
        db.Integer,
        db.ForeignKey('animes_genres.id'),
        primary_key=True
    ),
    db.Column(
        'anime_id',
        db.Integer,
        db.ForeignKey('animes.id'),
        primary_key=True
    )
)


class Anime(db.Model):
    __tablename__ = 'animes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text(), nullable=False)
    title_english = db.Column(db.Text(), nullable=False)
    title_romanji = db.Column(db.Text(), nullable=True)
    others = db.Column(db.Text(), nullable=False)
    type = db.Column(db.String(25), nullable=False)
    status = db.Column(db.Integer, nullable=False)
    popularity = db.Column(db.Float, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    url_image = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Float, nullable=False)
    start_date_year = db.Column(db.Integer, nullable=True)
    nb_eps = db.Column(db.String(25), nullable=False)
    genres = db.relationship(
        'AnimeGenre',
        secondary=genres,
        lazy='subquery',
        backref=db.backref('animes', lazy=True)
    )


class AnimeGenre(db.Model):
    __tablename__ = 'animes_genres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)


class AnimeGenreSchema(ma.SQLAlchemySchema):
    class Meta:
        model = AnimeGenre

    name = ma.auto_field()


class AnimeSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Anime
        include_fk = True

    id = ma.auto_field()
    title = ma.auto_field()
    title_english = ma.auto_field()
    title_romanji = ma.auto_field()
    others = ma.auto_field()
    type = ma.auto_field()
    status = ma.auto_field()
    popularity = ma.auto_field()
    url = ma.auto_field()
    url_image = ma.auto_field()
    score = ma.auto_field()
    start_date_year = ma.auto_field()
    nb_eps = ma.auto_field()
    genres = ma.Nested(AnimeGenreSchema, many=True)


animes_schema = AnimeSchema(many=True)
