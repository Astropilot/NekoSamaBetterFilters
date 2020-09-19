import $ from 'jquery';
import videojs from 'video.js';
import 'semantic-ui-transition/transition';
import 'semantic-ui-dropdown/dropdown';
import NProgress from 'nprogress';

import './anime-episode.scss';
import { optionsStorage } from '../../options-storage';
import { initPlayer, VideoSource } from './player';

interface Episode {
  time: string;
  episode: string;
  title: string;
  url: string;
  url_image: string;
}

const player: videojs.Player = initPlayer(onChangeEpisode);

let episodes: Episode[];
let currentEpisode = parseInt($('.details > .info > h2').text().match(/\d+/)!![0], 10) - 1;

function loadEpisode(hosts: any, autoplay: boolean) {
  $('#download-episode').remove();
  $('.anime-video-options > .item.right').empty();

  if (currentEpisode > 0) {
    (player.getChild('controlBar')!!.getChild('previousButton')!! as videojs.Button).enable();
  } else {
    (player.getChild('controlBar')!!.getChild('previousButton')!! as videojs.Button).disable();
  }
  if (currentEpisode < episodes.length - 1) {
    (player.getChild('controlBar')!!.getChild('nextButton')!! as videojs.Button).enable();
  } else {
    (player.getChild('controlBar')!!.getChild('nextButton')!! as videojs.Button).disable();
  }

  if (currentEpisode > 0) {
    $('.anime-video-options > .item.right').append(`
      <a class="ui button small with-svg-left" href="${episodes[currentEpisode - 1].url}">
        <svg class="n" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>
        Episode précédent
      </a>
    `);
  }
  if (currentEpisode < episodes.length - 1) {
    $('.anime-video-options > .item.right').append(`
      <a class="ui button small with-svg-right" href="${episodes[currentEpisode + 1].url}">
        <svg class="n" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>
        Episode suivant
      </a>
    `);
  }

  $.getJSON('https://nekosama.codexus.fr/api/hosts', hosts, async (data: any) => {
    const { streamResolution } = await optionsStorage.getAll();
    const prefHost = streamResolution.split('|')[1];
    const sources: VideoSource[] = [];

    let prefResolution = parseInt(streamResolution.split('|')[0], 10);
    const resolutions = Object.keys(data.pstream).sort((a, b) => {
      const c = parseInt(a, 10);
      const d = parseInt(b, 10);
      return isNaN(c) || isNaN(d) ? c > d ? 1 : -1 : c - d
    }).reverse();

    if (prefHost === 'pstream') {
      for (let resolution of resolutions) {
        resolution = resolution.split('x')[resolution.split('x').length - 1];
        const numericResolution = parseInt(resolution, 10);

        if (numericResolution === prefResolution || prefResolution > numericResolution) {
          prefResolution = numericResolution;
          break;
        }
      }
    }

    resolutions.forEach(function (resolution) {
      const pureResolution = resolution.split('x')[resolution.split('x').length - 1];
      const numericResolution = parseInt(pureResolution, 10);
      const source: VideoSource = {
        type: 'video/mp4',
        src: data.pstream[resolution],
        label: pureResolution + 'p (Stream)',
        selected: numericResolution === prefResolution && prefHost === 'pstream'
      };
      sources.push(source);
    });

    const source: VideoSource = {
      type: 'video/mp4',
      src: data.mystream,
      label: '720p (MyStream)',
      selected: prefHost === 'mystream'
    };
    sources.push(source);

    player.src(sources);
    if (autoplay) {
      player.play();
    }

    let items = '';
    const downloadDropdown = `
      <div id="download-episode" class="ui dropdown labeled icon with-svg-left button">
      <svg class="n" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
        <div class="text">Télécharger l'épisode</div>
        <div class="menu">
          %items%
        </div>
      </div>
    `;

    for (const resolution of resolutions) {
      items += `<a href="${data.pstream[resolution]}" class="item" target="_blank">Télécharger en ${resolution}p (Stream)</a>`;
    }
    items += `<a href="${data.mystream}" class="item" target="_blank">Télécharger en 720p (MyStream)</a>`;

    $('.anime-info > .actions').html(
      downloadDropdown.replace('%items%', items)
    );

    $('#download-episode').dropdown({
      context: $(window.window) as any,
      direction: 'upward',
      action: 'nothing'
    });

    NProgress.done();
  });
}

function onChangeEpisode(direction: string) {
  if (direction === 'previous' && currentEpisode > 0) {
    currentEpisode--;
  } else if (direction === 'next' && currentEpisode < episodes.length - 1) {
    currentEpisode++;
  } else {
    return;
  }

  NProgress.start();
  const animeUrl = episodes[currentEpisode].url;

  history.pushState(
    {},
    '',
    window.location.origin + animeUrl
  );

  $.get('https://www.neko-sama.fr' + animeUrl, (data: string) => {
    const pageTitle = data.match(/<title>(.*)<\/title>/)!![1];
    const episodeTitle = data.match(/<div class="row no-gutters">[\s\n]*<h1>(.*)<\/h1>/)!![1];
    const episodeNumber = data.match(/<h2>\s*(Episode .*)<\/h2>/)!![1];

    document.title = pageTitle;
    $('.row.no-gutters > h1').text(episodeTitle);
    $('.details > .info > h2').text(episodeNumber);

    const hosts: any = {
      pstream_url: data.match(/video\[0] = '(.*(pstream|mystream).*)'/)!![1],
      mystream_url: data.match(/video\[1] = '(.*(pstream|mystream).*)'/)!![1]
    };

    loadEpisode(hosts, true);
  });
}

NProgress.start();

const animeUrl = $('.details > .info > h1 > a').attr('href')!!;
$.get('https://www.neko-sama.fr' + animeUrl, function (response: string) {
  const dataEpisodes = response.match(/var episodes = (\[.*\])/)!![1];

  episodes = JSON.parse(dataEpisodes);

  const hosts: any = {
    pstream_url: $('script[type="text/javascript"]:not([src])').text().match(/video\[0] = '(.*(pstream|mystream).*)'/)!![1],
    mystream_url: $('script[type="text/javascript"]:not([src])').text().match(/video\[1] = '(.*(pstream|mystream).*)'/)!![1]
  };

  loadEpisode(hosts, false);
});
