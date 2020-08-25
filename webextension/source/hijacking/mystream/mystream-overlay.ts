import {nodeMatchSelector, nodeContentStartsWith, hijackDOM} from '../utils';
import {optionsStorage} from '../../options-storage';

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
  }

  if (nodeMatchSelector(addedNode, 'script[src^="https://inpagepush.com"]')) {
    addedNode.src = '';
    return true;
  }

  return false;
};

(async () => {
  const {adblock} = await optionsStorage.getAll();

  if (adblock) {
    hijackDOM(document.documentElement, 3, onNewNode);

    document.addEventListener('DOMContentLoaded', () => {
      const overlay = document.querySelector('body > div[style]:empty');
      if (overlay) {
        overlay.remove();
      }
    });
  }
})();
