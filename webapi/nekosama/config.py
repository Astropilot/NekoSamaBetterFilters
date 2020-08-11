import os
# from utils.jobs import fetch_animes

basedir = os.path.abspath(os.path.dirname(__file__))

TMP_FOLDER = os.path.join(basedir, 'tmp')

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(TMP_FOLDER, 'animes.db')
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
