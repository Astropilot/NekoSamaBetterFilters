import { nodeMatchSelector, hijackDOM } from '../../utils';

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script[type="text/javascript"]:not([src])')) {
    //addedNode.textContent = addedNode.textContent.replace(/#display-player/g, '#none').replace(/#host-dropdown/g, '#none');
    addedNode.textContent = '';
    return true;
  } else if (nodeMatchSelector(addedNode, '.anime-video-options > .item:not(.right)')) {
    //addedNode.remove();
    addedNode.textContent = '';
    return true;
  }

  return false;
};

hijackDOM(document.documentElement, 2, onNewNode);
