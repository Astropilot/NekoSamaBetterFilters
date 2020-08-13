import os

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres@nekosamadb:5432/nekosama'
SQLALCHEMY_TRACK_MODIFICATIONS = False
