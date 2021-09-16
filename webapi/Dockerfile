FROM python:3.7

RUN apt-get update && apt-get install -y --no-install-recommends build-essential postgresql gcc g++ python3-dev musl-dev curl libxslt-dev openssl ffmpeg wget

# Dependencies for compiling mtn
RUN apt-get install -y --no-install-recommends git libgd-dev libavutil-dev libavcodec-dev libavformat-dev libswscale-dev make

# Compiling mtn on devel branch from git
RUN wget https://gitlab.com/movie_thumbnailer/mtn/-/archive/devel/mtn-devel.tar.gz
RUN tar -xf mtn-devel.tar.gz
RUN cd mtn-devel/src && make install

RUN mkdir /code
WORKDIR /code

COPY requirements.txt ./

RUN pip install --upgrade pip && PYCURL_SSL_LIBRARY=openssl cat requirements.txt | xargs -n 1 -L 1 pip install

COPY . /code
