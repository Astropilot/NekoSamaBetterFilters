import { nodeMatchSelector, nodeContentStartsWith, hijackDOM } from '../../utils';

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script:not([src]):not([id])')) {
    if (nodeContentStartsWith(addedNode, 'var MAX_ITEMS_PER_PAGE')) {
      addedNode.textContent = '';
      return true;
    }
  } else if (nodeMatchSelector(addedNode, 'script[id="template"]')) {
    addedNode.textContent = '';
    return true;
  } else if (nodeMatchSelector(addedNode, 'div[id="regular-list-animes"]')) {
    addedNode.remove();
    return true;
  }

  return false;
};

hijackDOM(document.documentElement, 3, onNewNode);
