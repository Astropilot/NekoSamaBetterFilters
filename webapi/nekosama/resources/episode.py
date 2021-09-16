import requests
import re
import json
from flask import current_app
from flask_restful import Resource


NEKO_EPISODES_URL = 'https://neko-sama.fr/'

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}

class LastEpisodeResource(Resource):
    def get(self):

        if current_app.config['USE_PROXY'] is True:
            proxies = {current_app.config['PROXY_TYPE']: current_app.config['PROXY_ADDRESS']}
        else:
            proxies = None

        response = requests.get(NEKO_EPISODES_URL, headers=headers, proxies=proxies)

        if response.status_code != 200:
            return {'error': 'Error while fetching source'}, 500

        html_response = response.text

        episode_list_matches = re.search(r'var lastEpisodes = (\[.+]);', html_response)

        if not episode_list_matches:
            return {'error': 'Cannot find latest episodes'}, 500

        episode_list = episode_list_matches.group(1)
        episode_list = json.loads(episode_list)

        today_episodes = []

        for episode in episode_list:
            if 'heure' in episode['time']:
                today_episodes.append(episode)

        return today_episodes, 200
