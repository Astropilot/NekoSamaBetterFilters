const onNewNode = addedNode => {
  if (addedNode.nodeType === 1 && addedNode.matches('script:not([src]):not([type])')) {
    if (addedNode.textContent.trim().startsWith('window.adblock')) {
      addedNode.textContent = addedNode.textContent.replace(
        'window.adblock = true;',
        'window.adblock = false;'
      );
      return true;
    }

    if (addedNode.textContent.trim().startsWith('window.') && !addedNode.textContent.trim().startsWith('window.HELP_IMPROVE_VIDEOJS')) {
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

  return false;
};

async function hijackMyStream() {
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
}

hijackMyStream();
