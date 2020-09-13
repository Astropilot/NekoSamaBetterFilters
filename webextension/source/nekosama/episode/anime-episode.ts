import {runInPageContext} from '../../utils';
import $ from 'jquery';
import NProgress from 'nprogress';
import 'semantic-ui-transition/transition';
import 'semantic-ui-dropdown/dropdown';

interface Episode {
  time: string;
  episode: string;
  title: string;
  url: string;
  url_image: string;
}

let episodes: Episode[];
let currentEpisode: number;

const sourceChoice = `
  <div id="quality-selector" class="ui dropdown labeled icon with-svg-left button">
  <svg class="n" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
    <div class="text">Télécharger l'épisode via %host%</div>
    <div class="menu">
      %items%
    </div>
  </div>
`;

browser.runtime.onMessage.addListener(message => {
  if (!Object.prototype.hasOwnProperty.call(message, 'sources')) {
    return;
  }
  const downloads = message.sources;

  let items = '';
  const host = $('#host-dropdown > .text').contents().filter(function(){
    return this.nodeType == 3;
  })[0].nodeValue || '';

  for (const source of Object.keys(downloads)) {
    items += `<a href="${downloads[source]}" class="item" target="_blank">Télécharger en ${source}p</a>`;
  }

  $('.anime-info > .actions').html(
    sourceChoice.replace('%items%', items).replace('%host%', host.toLowerCase())
  );

  runInPageContext(() => {
    jQuery('#quality-selector').dropdown({
      action: 'nothing'
    });
  }, true);
});

browser.runtime.sendMessage({nekoFrom: 'anime-episode'});

window.onmessage = function(event: MessageEvent<any>) {
  if (Object.prototype.hasOwnProperty.call(event.data, 'episodes')) {
    ($('#un_episode')[0] as HTMLIFrameElement).contentWindow!!.postMessage(
      {isPrevious: currentEpisode > 0, isNext: currentEpisode < episodes.length - 1},
      '*'
    )
    return;
  };

  if (!Object.prototype.hasOwnProperty.call(event.data, 'action')) {
    return;
  }
  if (event.data.action !== 'previous' && event.data.action !== 'next') {
    return;
  }

  if (event.data.action === 'previous' && currentEpisode > 0) {
    currentEpisode--;
  } else if (event.data.action === 'next' && currentEpisode < episodes.length - 1) {
    currentEpisode++;
  } else {
    return;
  }

  NProgress.start();
  const url = episodes[currentEpisode].url;

  history.pushState(
    {},
    '',
    window.location.origin + url
  );

  $.get('https://www.neko-sama.fr' + url, (data: string) => {
    const pageTitle = data.match(/<title>(.*)<\/title>/)!![1];
    const episodeTitle = data.match(/<div class="row no-gutters">[\s\n]*<h1>(.*)<\/h1>/)!![1];
    const episodeNumber = data.match(/<h2>\s*(Episode .*)<\/h2>/)!![1];

    document.title = pageTitle;
    $('.row.no-gutters > h1').text(episodeTitle);
    $('.details > .info > h2').text(episodeNumber);

    $('.anime-video-options > .item.right').empty();

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

    if (event.data.host === 'pstream') {
      const hostUrl = data.match(/video\[0] = '(.*(pstream|mystream).*)'/)!![1];

      browser.runtime.sendMessage({nekoTo: 'pstream-overlay', msg: {fetch: hostUrl}});
    } else if (event.data.host === 'mystream') {
      const hostUrl = data.match(/video\[1] = '(.*(pstream|mystream).*)'/)!![1];

      browser.runtime.sendMessage({nekoTo: 'mystream-overlay', msg: {fetch: hostUrl}});
    }

    ($('#un_episode')[0] as HTMLIFrameElement).contentWindow!!.postMessage(
      {isPrevious: currentEpisode > 0, isNext: currentEpisode < episodes.length - 1},
      '*'
    )

    NProgress.done();
  });
};

const animeUrl = $('.details > .info > h1 > a').attr('href')!!;

currentEpisode = parseInt($('.details > .info > h2').text().match(/\d+/)!![0], 10) - 1;
$.get('https://www.neko-sama.fr' + animeUrl, function(response: string) {
  const dataEpisodes = response.match(/var episodes = (\[.*\])/)!![1];

  episodes = JSON.parse(dataEpisodes);
});
