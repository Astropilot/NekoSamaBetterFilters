import os
from distutils.util import strtobool


ELASTICSEARCH_HOST = os.environ.get('ELASTICSEARCH_HOST', 'localhost')

MAIL_ACTIVE_LOGS = bool(strtobool(os.environ.get('MAIL_ACTIVE_LOGS', 'False')))
MAIL_SERVER = os.environ.get('MAIL_SERVER')
MAIL_PORT = int(os.environ.get('MAIL_PORT', 0))
MAIL_USE_TLS = bool(strtobool(os.environ.get('MAIL_USE_TLS', 'False')))
MAIL_USE_SSL = bool(strtobool(os.environ.get('MAIL_USE_SSL', 'False')))
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_DEFAULT_SENDER = ('NekoSama API', os.environ.get('MAIL_USERNAME'))
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

MAIL_LOGS_RECIPIENT = [os.environ.get('MAIL_LOGS_RECIPIENT')]

USE_PROXY = bool(strtobool(os.environ.get('USE_PROXY', 'False')))
PROXY_TYPE = os.environ.get('PROXY_TYPE')
PROXY_ADDRESS = os.environ.get('PROXY_ADDRESS')
