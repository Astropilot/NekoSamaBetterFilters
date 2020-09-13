import {nodeMatchSelector, nodeContentStartsWith, hijackDOM, runInPageContext} from '../../utils';
import {optionsStorage} from '../../options-storage';
import {VideoSource, playerOverlay} from '../host-utils';
import $ from 'jquery';

declare const vsuri: any;

const fetchDownloads = (content: string): string => {
  var url = content.match(/vsuri *= *'(.*)';/)!![1];
  $.getJSON(url, function(sources) {
    browser.runtime.sendMessage({nekoFrom: 'pstream-overlay', nekoTo: 'anime-episode', msg: {sources: sources}});
  });
  return url;
}

const onNewNode = (addedNode: any) => {

  if (nodeMatchSelector(addedNode, 'script[data-cfasync="false"]')) {
    addedNode.textContent = '';
    return true;
  }

  if (nodeMatchSelector(addedNode, 'script')) {
    if (nodeContentStartsWith(addedNode, 'var vsuri')) {;
      fetchDownloads(addedNode.textContent);
      addedNode.textContent = addedNode.textContent.replace(
        'var safeloadPBAFS = false;',
        'var safeloadPBAFS = true;'
      ).replace(
        'document.head.appendChild(importFAB);',
        ''
      );

      return true;
    }
  }

  return false;
};

hijackDOM(document.documentElement, 2, onNewNode);

const initPlayer = (sources_url: string | null, streamResolution: string, autoplay: boolean) => {
  jQuery('.bruh-overlay').remove();

  jQuery.getJSON(sources_url || vsuri, function(sources) {
    const player = videojs.getPlayer('video_player');
    const playerSources: VideoSource[] = [];
    let prefResolution = parseInt(streamResolution, 10);

    const resolutions = Object.keys(sources).sort((a, b) => {
      const c = parseInt(a, 10);
      const d = parseInt(b, 10);
      return isNaN(c) || isNaN(d) ? c > d ? 1 : -1 : c - d
    }).reverse();

    for (let resolution of resolutions) {
      resolution = resolution.split('x')[resolution.split('x').length - 1];
      const numericResolution = parseInt(resolution, 10);

      if (numericResolution === prefResolution || prefResolution > numericResolution) {
        prefResolution = numericResolution;
        break;
      }
    }

    resolutions.forEach(function(resolution) {
      const pureResolution = resolution.split('x')[resolution.split('x').length - 1];
      const numericResolution = parseInt(pureResolution, 10);
      const source: VideoSource = {
        type: 'video/mp4',
        src: sources[resolution],
        label: pureResolution + 'p',
        selected: numericResolution === prefResolution
      };
      playerSources.push(source);
    });

    player.src(playerSources);
    if (autoplay) {
      player.play();
    }
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const {streamResolution} = await optionsStorage.getAll();

  runInPageContext(initPlayer, true, null, streamResolution, false);

  runInPageContext(playerOverlay, true, 'video_player', 'pstream');
});

browser.runtime.onMessage.addListener(message => {
  if (!Object.prototype.hasOwnProperty.call(message, 'fetch')) {
    return;
  }

  $.get(message.fetch, async (response: string) => {

    const url = fetchDownloads(response);
    const {streamResolution} = await optionsStorage.getAll();

    runInPageContext(initPlayer, true, url, streamResolution, true);
  });
});
