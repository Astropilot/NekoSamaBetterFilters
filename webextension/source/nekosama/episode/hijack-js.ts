import { nodeMatchSelector, hijackDOM } from '../../utils';

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script[type="text/javascript"]:not([src])')) {
    addedNode.textContent = addedNode.textContent.replace(/#display-player/g, '#none');
    return true;
  }

  return false;
};

hijackDOM(document.documentElement, 1, onNewNode);
