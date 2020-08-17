FROM python:3.7

RUN apt-get update && apt-get install -y --no-install-recommends build-essential postgresql gcc g++ python3-dev musl-dev curl libxslt-dev openssl

RUN mkdir /code
WORKDIR /code

COPY requirements.txt ./

RUN pip install --upgrade pip && PYCURL_SSL_LIBRARY=openssl cat requirements.txt | xargs -n 1 -L 1 pip install

COPY . /code
