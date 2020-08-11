from flask import current_app
import requests
from requests.auth import HTTPBasicAuth
from bs4 import BeautifulSoup


def get_with_auth(url):
    req = requests.get(url, auth=HTTPBasicAuth(current_app.config['EDT_USER'], current_app.config['EDT_PASS']))
    req.encoding = 'utf-8'
    return req


def get_groups():
    group_list = None
    res = get_with_auth('http://chronos.iut-velizy.uvsq.fr/EDT/gindex.html')
    if res.status_code == 200:
        try:
            groups_html = res.text
            soup = BeautifulSoup(groups_html, features="html.parser")
            group_list = soup.find('select',attrs={"name":u"menu2"}).findAll('option')[1:]
        except:
            return None
    return group_list


def get_chronos_file(group_id):
    res = get_with_auth('http://chronos.iut-velizy.uvsq.fr/EDT/%s.xml' % group_id)
    if res.status_code == 200:
        return res.text
    else:
        return None
