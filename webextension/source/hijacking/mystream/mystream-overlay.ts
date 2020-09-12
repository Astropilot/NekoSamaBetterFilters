import {nodeMatchSelector, nodeContentStartsWith, hijackDOM} from '../utils';
import {optionsStorage} from '../../options-storage';

async function fetchDownloads(scriptContent: string) {
  const payload = String.raw`${scriptContent}`;
  const i = payload.search(/\$\.\$\(\$\.\$\(/);
  var toExecute = 'var ' + payload.slice(0, i);

  const toExecuteStart = payload.search(/\$\.\$\(\$\.\$\(/) + 4;
  const toExecuteEnd = payload.search(/\)\(\);/);
  toExecute += payload.slice(toExecuteStart, toExecuteEnd);

  const res = eval(String.raw`${toExecute}`);

  const url = res.match(/https:\/\/.*\.mp4/)[0];
  browser.runtime.sendMessage({to: 'anime-episode', msg: {720: url}});
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

(async () => {
  const {adblock} = await optionsStorage.getAll();

  if (adblock) {
    hijackDOM(document.documentElement, 2, onNewNode);

    document.addEventListener('DOMContentLoaded', () => {
      const overlay = document.querySelector('body > div[style]:empty');
      if (overlay) {
        overlay.remove();
      }
    });
  }
})();
