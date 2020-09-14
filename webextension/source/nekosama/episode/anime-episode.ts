import $ from 'jquery';
import videojs, { VideoJsPlayer } from 'video.js';
require('@silvermine/videojs-quality-selector')(videojs);
require('videojs-hotkeys');

/*import { runInPageContext } from '../../utils';
import $ from 'jquery';
import NProgress from 'nprogress';
import 'semantic-ui-transition/transition';
import 'semantic-ui-dropdown/dropdown';
import videojs from 'video.js';

interface Episode {
  time: string;
  episode: string;
  title: string;
  url: string;
  url_image: string;
}*/

export interface VideoSource extends videojs.Tech.SourceObject {
  label: string;
  selected: boolean;
};

/*let episodes: Episode[];
let currentEpisode = parseInt($('.details > .info > h2').text().match(/\d+/)!![0], 10) - 1;;

const animeUrl = $('.details > .info > h1 > a').attr('href')!!;
$.get('https://www.neko-sama.fr' + animeUrl, function (response: string) {
  const dataEpisodes = response.match(/var episodes = (\[.*\])/)!![1];

  episodes = JSON.parse(dataEpisodes);
});

$.getJSON('', '', (data: any) => {

});*/

const playerHtml = `
<video id="video_player" class="video-js vjs-big-play-centered" controls controlslist="nodownload" preload="none" poster="" data-matomo-title="mqn9EBYnlZQO1e7">
<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
    </video>
`;

$('#display-player').html(playerHtml);

class BrandButon extends videojs.getComponent("Component") {
  constructor(player: VideoJsPlayer, options = {}) {
    super(player, options);
    this.addClass("vjs-custom-brand");
    $(this.el()).html('<a href="https://www.neko-sama.fr" target="_blank" rel="noopener noreferrer"></a>');
  }
}


videojs.registerComponent("brandButton", BrandButon);
const player = videojs("video_player", {
  playbackRates: [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2],
  controlBar: {
    children: ["playToggle", "volumePanel", "currentTimeDisplay", "timeDivider", "durationDisplay", "progressControl", "customControlSpacer", "brandButton", "qualitySelector", "fullscreenToggle"]
  }
});

const source: VideoSource[] = [{
  type: 'video/mp4',
  src: 'https://xaibqklqcr.mstreamcdn.com/v/eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjpbIjgwLjIxNS4xMDAuMjQ4Iiwid2ltemp5dTZnbmk1IiwibiIsMV0sImV4cCI6MTYwMDE0MTU1OX0.tr4uGXu-rvcwYnCJXqDTlnsFNJ8RHkSzUDkWIPXf1xo.mp4',
  label: '720p',
  selected: true
}, {
  type: 'video/mp4',
  src: 'https://515.str.gcdn.me/stream/ri4w1GapzRBhFxeLIS-Q0g_1600102925/i9TJteCwitU6eaepcJPivskfTqsKOV3Pn8zi09K5/480/260358/mqn9EBYnlZQO1e7.mp4',
  label: '480p',
  selected: false
}];
player.src(source);

/*const sourceChoice = `
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
  const host = $('#host-dropdown > .text').contents().filter(function () {
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

window.onmessage = function (event: MessageEvent<any>) {
  if (Object.prototype.hasOwnProperty.call(event.data, 'episodes')) {
    ($('#un_episode')[0] as HTMLIFrameElement).contentWindow!!.postMessage(
      { isPrevious: currentEpisode > 0, isNext: currentEpisode < episodes.length - 1 },
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

    const hosts: any = {
      pstream: data.match(/video\[0] = '(.*(pstream|mystream).*)'/)!![1],
      mystream: data.match(/video\[1] = '(.*(pstream|mystream).*)'/)!![1]
    };

    runInPageContext((pstream: string, mystream: string) => {
      video[0] = pstream;
      video[1] = mystream;
    },
      true,
      hosts.pstream,
      hosts.mystream
    )

    browser.runtime.sendMessage({ nekoTo: 'pstream-overlay', msg: { fetch: hosts[event.data.host] } });

    ($('#un_episode')[0] as HTMLIFrameElement).contentWindow!!.postMessage(
      { isPrevious: currentEpisode > 0, isNext: currentEpisode < episodes.length - 1 },
      '*'
    )

    NProgress.done();
  });
};*/
