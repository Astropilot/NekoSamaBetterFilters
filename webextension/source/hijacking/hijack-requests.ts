
const tabData = new Map();

function recordFrame(tabId: number, frameId: number, frameUrl: string) {
  if (!tabData.has(tabId)) {
    tabData.set(tabId, {
      frames: new Map()
    });
  }

  tabData.get(tabId).frames.set(frameId, {
    url: frameUrl
  });
}

function getUrlForTab(tabId: number) {
  const frameId = 0;
  if (tabData.has(tabId)) {
    if (tabData.get(tabId).frames.has(frameId)) {
      return tabData.get(tabId).frames.get(frameId).url;
    }
  }

  return null;
}

browser.webRequest.onBeforeRequest.addListener(
  details => {
    if (details.type === 'main_frame' || details.type === 'sub_frame') {
      recordFrame(details.tabId, details.frameId, details.url);
      return {};
    }

    const tabUrl = getUrlForTab(details.tabId);

    if (tabUrl?.match(/\/anime(\?.*|)$/)) {
      if (details.url.startsWith('https://www.neko-sama.fr/js/nekosama-libs.js')) {
        return {
          cancel: true
        };
      }
    }

    return {};
  },
  {urls: ['*://*.neko-sama.fr/*']},
  ['blocking']
);
