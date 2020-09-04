import {nodeMatchSelector, nodeContentStartsWith, hijackDOM, runInPageContext} from '../utils';
import {optionsStorage} from '../../options-storage';

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script[data-cfasync="false"]')) {
    addedNode.textContent = '';
    return true;
  }

  if (nodeMatchSelector(addedNode, 'script[type="text/javascript"]')) {
    if (nodeContentStartsWith(addedNode, 'var vsuri')) {
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

(async () => {
  const {adblock} = await optionsStorage.getAll();

  if (adblock) {
    hijackDOM(document.documentElement, 2, onNewNode);

    const sendEvent = () => {
      jQuery(document).on('ready', () => {
        jQuery('.bruh-overlay').remove();
        jQuery(document).trigger('manual-trigger');
      });
    };

    document.addEventListener('DOMContentLoaded', () => {
      runInPageContext(sendEvent, true);
    });
  }
})();
