import $ from 'jquery';
import videojs, { VideoJsPlayer } from 'video.js';
import 'semantic-ui-transition/transition';
import 'semantic-ui-dropdown/dropdown';
import 'semantic-ui-dimmer/dimmer';
import 'semantic-ui-modal/modal';
import NProgress from 'nprogress';

import './anime-episode.scss';
import { optionsStorage } from '../../options-storage';
import { initPlayer, VideoSource } from './player';
import spriteThumbs from './sprite-thumbnails';

interface Anime {
  name: string;
  episodes: Episode[];
  currentEpisodeIndex: number;
}

interface Episode {
  time: string;
  episode: string;
  title: string;
  url: string;
  url_image: string;
  ep_number: number;
}

let anime: Anime;
let player: VideoJsPlayer | null = null;

async function getAnime(): Promise<Anime> {
  const anime: Anime = {
    name: '',
    episodes: [],
    currentEpisodeIndex: -1
  };

  const animeUrl = $('.details > .info > h1 > a').attr('href')!!;
  const currentEpisodeNumber = parseInt($('.details > .info > h2').text().match(/\d+/)!![0]!, 10);

  const response: string = await $.get('https://neko-sama.fr' + animeUrl);

  const dataEpisodes = response.match(/var episodes = (\[.*\])/)!![1]!;

  anime.episodes = JSON.parse(dataEpisodes);

  if (anime.episodes.length > 0) {
    anime.name = anime.episodes[0]!.title;
  }

  for (let i = 0; i < anime.episodes.length; i++) {
    const episodeNumber = parseInt(anime.episodes[i]!.episode.match(/\d+/)![0]!, 10);
    anime.episodes[i]!.ep_number = episodeNumber;
    if (anime.currentEpisodeIndex === -1 && episodeNumber === currentEpisodeNumber) {
      anime.currentEpisodeIndex = i;
    }
  }

  return anime;
}

async function getEpisodeHosts(episode: Episode): Promise<string[]> {
  const hosts: string[] = [];

  const response: string = await $.get('https://neko-sama.fr' + episode.url);

  const hostMatches = [...response.matchAll(/video\[(\d+)] = '(.*)';/gm)];

  for (const hostMatch of hostMatches) {
    hosts[parseInt(hostMatch[1]!, 10)] = (hostMatch[2]! === '' ? '-1' : hostMatch[2]!);
  }

  return hosts;
}

function extractPStreamFromHosts(hosts: string[]): string | null {
  for (const host of hosts) {
    if (host.startsWith('https://www.pstream.net')) {
      return host;
    }
  }
  return null;
}

function setEpisodeToScreen(anime: Anime): void {
  const episode = anime.episodes[anime.currentEpisodeIndex]!;

  document.title = `${anime.name} - Episode ${episode.ep_number} - Neko-sama`;
  $('.row.no-gutters > h1').text(`${anime.name} - Episode ${episode.ep_number}`);
  $('.details > .info > h2').text(`Episode ${episode.ep_number}`);
}

function displayHostsSelector(hosts: string[]): void {
  let hostElements: string = '<div data-value="neko" class="item active selected">NEKO-SAMA <small>FHD</small></div>';

  $('.anime-video-options > .item:not(.right)').empty();

  for (let i = 0; i < hosts.length; i++) {
    hostElements += `<div data-value="${hosts[i]}" class="item">STREAM N°${i+1} <small>HD</small></div>`;
  }

  $('.anime-video-options > .item:not(.right)').html(`
    <p>Changer de lecteur</p>
    <div id="host-dropdown" tabindex="0" class="ui dropdown master button uppercase">
      <span class="text">
        NEKO-SAMA <small>FHD</small>
      </span>
      <i class="dropdown icon"></i>
      <div class="menu uppercase">
        ${hostElements}
      </div>
    </div>
  `);
}

async function fetchThumbnails(host_url: string, m3u8_url: string): Promise<void> {
  const m3u8_contents: string = await $.get(m3u8_url);

  const m3u8_blob = new Blob([m3u8_contents], {type: 'text/plain'});
  const form_data = new FormData();

  form_data.append('file', m3u8_blob, 'temp.txt');
  form_data.append('pstream_url', host_url);

  try {
    const thumbnail_sprite: any = await $.post({
      url: 'http://localhost:8000/api/thumbnails',
      data: form_data,
      contentType: false,
      processData: false,
      cache: false,
      dataType: 'json'
    });

    if (player) {
      spriteThumbs(player, {
        url: thumbnail_sprite.url,
        width: 160,
        height: 90,
        interval: 10,
        responsive: 600
      });
    }
  } catch (err) {
    console.log('Error while retreiving the thumbails sprite', err);
  }
}

async function setEpisodeToPlayer(anime: Anime, hosts: string[], autoplay: boolean): Promise<void> {
  const episode = anime.episodes[anime.currentEpisodeIndex]!;

  if (player === null) {
    player = initPlayer(onChangeEpisode);
  }

  if (anime.currentEpisodeIndex > 0) {
    (player.getChild('controlBar')!!.getChild('previousButton')!! as videojs.Button).enable();
  } else {
    (player.getChild('controlBar')!!.getChild('previousButton')!! as videojs.Button).disable();
  }
  if (anime.currentEpisodeIndex < anime.episodes.length - 1) {
    (player.getChild('controlBar')!!.getChild('nextButton')!! as videojs.Button).enable();
  } else {
    (player.getChild('controlBar')!!.getChild('nextButton')!! as videojs.Button).disable();
  }

  const pstream_url = extractPStreamFromHosts(hosts);

  if (pstream_url === null) {
    player.createModal('Neko-Sama ne donne pas de lien pour PStream !',
    {
      temporary: true,
      uncloseable: true
    });
    NProgress.done();
    return;
  }

  const pstream_contents: string = await $.get(pstream_url);

  const parser = new DOMParser();
  const pstreamDocument = parser.parseFromString(pstream_contents, 'text/html');
  const pstreamVideoJsFile = pstreamDocument.querySelector('script[type="text/javascript"][src^="https://www.pstream.net/js/videojs"]');

  if (pstreamVideoJsFile === null) {
    player.createModal('PStream ne semble pas avoir de lien disponible, il s\'agit possiblement d\'un lien mort ou d\'une vidéo en cours d\'encoding',
    {
      temporary: true,
      uncloseable: true
    });
    NProgress.done();
    return;
  }

  const pstreamSubtitles = pstreamDocument.querySelectorAll('track[kind="subtitles"]');
  const subtitles: any[] = [];

  if (pstreamSubtitles.length > 0) {
    for (const pstreamSubtitle of pstreamSubtitles) {
      subtitles.push({
        kind: pstreamSubtitle.getAttribute('kind'),
        src: pstreamSubtitle.getAttribute('src'),
        label: pstreamSubtitle.getAttribute('label'),
        default: pstreamSubtitle.getAttribute('default') !== null
      });
    }
  }

  const pstreamVideoJsFileContents: string = await $.get({url: pstreamVideoJsFile.getAttribute('src')!});

  const m3u8FileURL = JSON.parse(atob(pstreamVideoJsFileContents.match(/\"(eyJ[A-Za-z\d+/=]+)"/m)![1]!)).url;

  const m3u8_contents: string = await $.get(m3u8FileURL);

  console.log('m3u8_contents', m3u8_contents);

  const { streamResolution } = await optionsStorage.getAll();
  let prefResolution = parseInt(streamResolution, 10);
  const sources: VideoSource[] = [];
  const m3u8_sources: {[resolution: string]: string} = {};
  const m3u8_lines = m3u8_contents.split('\n');

  for (let i = 0; i < m3u8_lines.length; i++) {
    if (m3u8_lines[i]!.startsWith('#EXT-X-STREAM-INF')) {
      const full_resolution = m3u8_lines[i]!.match(/RESOLUTION=(\d*x\d*)/)![1]!.split('x');
      const res = full_resolution[full_resolution.length - 1]!;
      const url = m3u8_lines[i+1]!;

      m3u8_sources[res] = url;
    }
  }

  const resolutions = Object.keys(m3u8_sources).sort((a, b) => {
    const c = parseInt(a, 10);
    const d = parseInt(b, 10);
    return isNaN(c) || isNaN(d) ? c > d ? 1 : -1 : c - d
  }).reverse();

  for (let resolution of resolutions) {
    const numericResolution = parseInt(resolution, 10);

    if (numericResolution === prefResolution || prefResolution > numericResolution) {
      prefResolution = numericResolution;
      break;
    }
  }

  // Ask for thumbnails
  if ('480' in m3u8_sources) {
    fetchThumbnails(pstream_url, m3u8_sources['480']!);

    spriteThumbs(player, {});
  }


  resolutions.forEach(function (resolution) {
    const numericResolution = parseInt(resolution, 10);
    console.log(m3u8_sources[resolution]!);
    const source: VideoSource = {
      type: 'application/vnd.apple.mpegurl',
      src: m3u8_sources[resolution]!,
      label: resolution + 'p',
      selected: numericResolution === prefResolution
    };
    sources.push(source);
  });

  if (!autoplay) {
    player.poster(episode.url_image);
  } else {
    player.poster('');
  }

  player.src(sources);

  if (subtitles.length > 0) {
    for (const subtitle of subtitles) {
      player.addRemoteTextTrack({
        kind: subtitle.kind,
        src: subtitle.src,
        default: subtitle.default,
        label: subtitle.label
      }, false);
    }
  }

  if (autoplay) {
    player.play();
  }

  NProgress.done();
}

function onChangeEpisode(direction: 'previous' | 'next') {
  if (direction === 'previous' && anime.currentEpisodeIndex > 0) {
    anime.currentEpisodeIndex--;
  } else if (direction === 'next' && anime.currentEpisodeIndex < anime.episodes.length - 1) {
    anime.currentEpisodeIndex++;
  } else {
    return;
  }

  NProgress.start();
  loadEpisode(anime, false);
}

async function loadEpisode(anime: Anime, isFirstEpisodeToLoad: boolean) {
  const animeEpisode = anime.episodes[anime.currentEpisodeIndex]!;

  if (!isFirstEpisodeToLoad) {
    history.pushState(
      {},
      '',
      window.location.origin + animeEpisode.url
    );
  }

  setEpisodeToScreen(anime);

  $('.anime-video-options > .item.right').empty();

  if (anime.currentEpisodeIndex > 0) {
    $('.anime-video-options > .item.right').append(`
      <a class="ui button small with-svg-left" href="${anime.episodes[anime.currentEpisodeIndex - 1]!.url}">
        <svg class="n" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>
        Episode précédent
      </a>
    `);
  }
  if (anime.currentEpisodeIndex < anime.episodes.length - 1) {
    $('.anime-video-options > .item.right').append(`
      <a class="ui button small with-svg-right" href="${anime.episodes[anime.currentEpisodeIndex + 1]!.url}">
        <svg class="n" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>
        Episode suivant
      </a>
    `);
  }

  const hosts = await getEpisodeHosts(animeEpisode);

  displayHostsSelector(hosts);

  $('#host-dropdown').dropdown({
    context: $(window.window) as any, // Bypassing the Sandbox object that cause crash in the dropdown library
    onChange: function(value: string) {
      if (value === 'neko') {
        NProgress.start();
        setEpisodeToPlayer(anime, hosts, false);
      } else {
        player?.dispose();
        player = null;
        $('#display-player').html(`
          <iframe id="un_episode" src="${value === '-1' ? '' : value}" scrolling="no"
            frameborder="0" allowfullscreen="true" webkitallowfullscreen="true"
            referrerpolicy="no-referrer" mozallowfullscreen="true"></iframe>
        `);
      }
    }
  });

  setEpisodeToPlayer(anime, hosts, !isFirstEpisodeToLoad);
}

(async ()=>{

  NProgress.start();

  anime = await getAnime();

  await loadEpisode(anime, true);

})();


// Report modal part
$('#modal-report').modal({
  //context: $(window.window) as any,
  closable: true,
  onApprove: function() {
      $.post($('#form-report').attr('action')!, {
          'url': window.location.href,
          'content': $('#form-report textarea').val()
      });
  }
})
.modal('attach events', '#report-btn.button', 'show');
