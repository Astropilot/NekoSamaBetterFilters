import os
# from utils.jobs import fetch_animes

basedir = os.path.abspath(os.path.dirname(__file__))

DATABASE_FOLDER = os.path.join(basedir, 'database')
DATABASE_FILE = 'animes.db'
DATABASE_PATH = os.path.join(DATABASE_FOLDER, DATABASE_FILE)

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE_PATH
SQLALCHEMY_TRACK_MODIFICATIONS = False

# JOBS = [
#     {
#         'id': 'job_animes',
#         'func': fetch_animes,
#         'trigger': 'interval',
#         'minutes': 5
#     }
# ]
# SCHEDULER_API_ENABLED = True
