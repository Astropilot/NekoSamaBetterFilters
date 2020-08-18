const tabData = new Map();

function recordFrame(tabId, frameId, frameUrl) {
  if (!tabData.has(tabId)) {
    tabData.set(tabId, {
      frames: new Map()
    });
  }

  tabData.get(tabId).frames.set(frameId, {
    url: frameUrl
  });
}

function getUrlForTab(tabId) {
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

    if (tabUrl && tabUrl.match(/\/anime(\?.*|)$/)) {
      if (details.url.startsWith('https://www.neko-sama.fr/js/nekosama-libs.js')) {
        return {
          redirectUrl: browser.runtime.getURL('vendors/nekosama-libs.min.js')
        };
      }
    }

    return {};
  },
  {urls: ['*://*.neko-sama.fr/*']},
  ['blocking']
);
