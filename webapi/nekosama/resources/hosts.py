from flask import request
from flask_restful import Resource
import requests
import re
from py_mini_racer import py_mini_racer

headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}

class HostsResource(Resource):
    def get(self):
        data = request.args

        neko_episode_url = data.get('neko_episode_url', None)
        pstream_url = data.get('pstream_url', None)
        mystream_url = data.get('mystream_url', None)

        response = {
            'pstream': {},
            'mystream': None
        }

        if pstream_url is None and mystream_url is None:
            return { 'error': 'Aucun lecteur détecté' }, 404

        if pstream_url is not None:
            r = requests.get(pstream_url, headers=headers)
            sources_url = re.search(r"vsuri *= *'(.*)';", r.text)
            if sources_url:
                sources_url = sources_url.group(1)
                r = requests.get(sources_url)
                response['pstream'] = r.json()

        if mystream_url is not None:
            r = requests.get(mystream_url, headers=headers)
            content = r.text

            start_payload = re.search(r'\$=~\[];', content).start()
            end_payload = re.search(r'\$\.\$\(\$\.\$\(', content).start()
            to_execute = 'var ' + content[start_payload:end_payload]

            start_payload = re.search(r'\$\.\$\(\$\.\$\(', content).start() + 4
            end_payload = re.search(r'\)\(\);', content).start()
            to_execute += content[start_payload:end_payload]

            ctx = py_mini_racer.MiniRacer()
            result = ctx.eval(to_execute)

            url = re.search(r'https:\/\/.*\.mp4', result).group()
            response['mystream'] = url

        return response, 200
