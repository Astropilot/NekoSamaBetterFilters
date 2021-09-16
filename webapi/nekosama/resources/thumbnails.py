import subprocess
import requests
import hashlib
import os
from flask import request
from flask_restful import Resource

from ..models.base import db
from ..models.thumbnail import Thumbnail


headers = { # Faked Firefox Browser
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'accept-language': 'fr-FR,fr;q=0.8,ru;q=0.6,en-US;q=0.4,en;q=0.2',
    'cache-control': 'no-cache',
    'cookie': '__cfduid=d187808f2b87b9ddd8706bbe763c878be1600534647',
    'dnt': '1',
    'te': 'Trailers',
    'pragma': 'no-cache',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'
}


def run_command(command: str, timeout: int) -> None:
    try:
        subprocess.run(
            command,
            timeout=timeout,
            check=True,
            text=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE
        )
    except subprocess.TimeoutExpired:
        raise Exception(f'The process process has timeout (>{timeout}s)! Command: {command}')
    except subprocess.CalledProcessError as err:
        raise Exception(f'An error occurred while executing process : {err.stderr}. Command: {command}')

def generate_thumbnail_sprite(video_file: str) -> None:
    command = f'mtn --options=protocol_whitelist:file,crypto,data,http,https,tcp,tls -c 5 -D 0 -g 0 -h 90 -i -n -o _sprite.jpg -P -q -s 10 -t -w 800 -z {video_file}'.split()

    run_command(command, 240)

def check_video_length(video_file: str) -> float:
    command = f'ffprobe -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -protocol_whitelist file,http,https,tcp,tls -v error -i {video_file}'.split()

    try:
        video_length_seconds = subprocess.check_output(command, timeout=15).decode()

        return float(video_length_seconds)

    except subprocess.TimeoutExpired:
        raise Exception(f'The process process has timeout (>15s)! Command: {command}')
    except subprocess.CalledProcessError as err:
        raise Exception(f'An error occurred while executing process : {err.stderr}. Command: {command}')
    except ValueError:
        raise Exception(f'Cannot convert the response of ffprobe to float!')

def generate_hash(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()

def upload_thumbnail_sprite(hash: str) -> str:
    files = {'files[]': open(f'{hash}_sprite.jpg', 'rb')}
    response = requests.post(f'https://epvpimg.com/upload/', files=files)

    return response.json()[0]['thumbnail_url']

class ThumbnailsResource(Resource):

    def post(self):
        data = request.form

        pstream_url = data.get('pstream_url', None)

        if pstream_url is None:
            return {'error': 'No URL provided!'}, 400

        if 'file' not in request.files:
            return {'error': 'No m3u8 file provided!'}, 400

        file = request.files['file']

        if file.filename != 'temp.txt':
            return {'error': 'No file uploaded or with incorrect name!'}, 400

        try:
            episode_hash = generate_hash(pstream_url)

            thumbnail = Thumbnail.query.filter_by(host_hash=episode_hash).first()

            if thumbnail is not None:
                return {'url': thumbnail.thumbnail_sprite_url}, 200

            file.save(f'{episode_hash}.m3u8')

            if not os.path.exists(f'{episode_hash}.m3u8'):
                print('m3u8 file do not exist!')
                return {'error': 'Failed to download pstream file'}, 500

            video_length_seconds = check_video_length(f'{episode_hash}.m3u8')
            if video_length_seconds > (30 * 60): # Max: 30min
                print(f'Video too long: {video_length_seconds}s!')
                return {'error': 'Video too long'}, 400

            generate_thumbnail_sprite(f'{episode_hash}.m3u8')

            sprite_url = upload_thumbnail_sprite(episode_hash)

            thumbnail = Thumbnail(
                host_hash=episode_hash,
                thumbnail_sprite_url=sprite_url
            )
            db.session.add(thumbnail)
            db.session.commit()

            return {'url': sprite_url}, 200
        except Exception as err:
            print(f'An exception occured: {err}')
            return {'error': 'An error occured!'}, 500
        finally:
            # Clean up
            sprite_filename = f'{episode_hash}_sprite.jpg'
            m3u8_filename = f'{episode_hash}.m3u8'

            if os.path.exists(sprite_filename):
                os.remove(sprite_filename)
            if os.path.exists(m3u8_filename):
                os.remove(m3u8_filename)
