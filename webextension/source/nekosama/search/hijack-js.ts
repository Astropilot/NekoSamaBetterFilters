import {nodeMatchSelector, nodeContentStartsWith, hijackDOM} from '../../utils';

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script:not([src]):not([id])')) {
    if (nodeContentStartsWith(addedNode, 'var myLazyLoad')) {
      const request = new XMLHttpRequest();
      request.open(
        'GET',
        browser.runtime.getURL('nekosama/search/better-filters.js'),
        false
      );
      request.send();

      addedNode.textContent = request.responseText;
      return true;
    }
  } else if (nodeMatchSelector(addedNode, 'script[id="template"]')) {
    const request = new XMLHttpRequest();
    request.open(
      'GET',
      browser.runtime.getURL('nekosama/search/template.html'),
      false
    );
    request.send();

    addedNode.textContent = request.responseText;
    return true;
  } else if (nodeMatchSelector(addedNode, 'div[id="regular-list-animes"]')) {
    addedNode.remove();
    return true;
  }

  return false;
};

hijackDOM(document.documentElement, 3, onNewNode);
