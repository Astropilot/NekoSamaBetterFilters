import {nodeMatchSelector, nodeContentStartsWith, hijackDOM, runInPageContext} from '../../utils';
import {VideoSource, playerOverlay} from '../host-utils';
import $ from 'jquery';

const fetchDownloads = (content: string): string => {
  const payload = String.raw`${content}`;
  let startPayload = payload.search(/\$=~\[];/);
  let endPayload = payload.search(/\$\.\$\(\$\.\$\(/);
  let toExecute = 'var ' + payload.slice(startPayload, endPayload);

  startPayload = payload.search(/\$\.\$\(\$\.\$\(/) + 4;
  endPayload = payload.search(/\)\(\);/);
  toExecute += payload.slice(startPayload, endPayload);

  const result = eval(String.raw`${toExecute}`);

  const url = result.match(/https:\/\/.*\.mp4/)[0];
  browser.runtime.sendMessage({nekoFrom: 'mystream-overlay', nekoTo: 'anime-episode', msg: {sources: {720: url}}});

  return url;
}

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script:not([src]):not([type])')) {
    if (nodeContentStartsWith(addedNode, 'window.adblock')) {
      addedNode.textContent = addedNode.textContent.replace(
        'window.adblock = true;',
        'window.adblock = false;'
      );
      return true;
    }

    if (nodeContentStartsWith(addedNode, 'window.') &&
        !nodeContentStartsWith(addedNode, 'window.HELP_IMPROVE_VIDEOJS')) {
      addedNode.textContent = addedNode.textContent.replace(
        'var firstfired=!1',
        'var firstfired=!0'
      ).replace(
        /"actions":\[[\d,]*]/g,
        '"actions":[]'
      ).replace(
        't("IFRAME")||t("VIDEO")||t("OBJECT")',
        '!1'
      );
      return true;
    }

    if (nodeContentStartsWith(addedNode, '$=~[];')) {
      fetchDownloads(String.raw`${addedNode.textContent}`);
    }
  }

  return false;
};

const newEpisode = (sourceUrl: string) => {
  const player = videojs.getPlayer('videoPlayer');
  const source: VideoSource[] = [{
    type: 'video/mp4',
    src: sourceUrl,
    label: '',
    selected: true
  }];
  player.src(source);
  player.play();
};

hijackDOM(document.documentElement, 2, onNewNode);

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('body > div[style]:empty');
  if (overlay) {
    overlay.remove();
  }

  runInPageContext(playerOverlay, true, 'videoPlayer', 'mystream');
});

browser.runtime.onMessage.addListener(message => {
  if (!Object.prototype.hasOwnProperty.call(message, 'fetch')) {
    return;
  }

  $.get(message.fetch, (response: string) => {
    const url = fetchDownloads(response);

    runInPageContext(newEpisode, true, url);
  });
});
