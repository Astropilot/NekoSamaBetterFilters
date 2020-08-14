const tabData = {};

function recordFrame(tabId, frameId, frameUrl) {
    if (!tabData.hasOwnProperty(tabId)) {
        tabData[tabId] = {
            frames: {},
            origins: {}
        };
    }
    tabData[tabId].frames[frameId] = {
        url: frameUrl
    };
}

function getUrlForTab(tabId) {
    frameId = 0;
    if (tabData.hasOwnProperty(tabId)) {
      if (tabData[tabId].frames.hasOwnProperty(frameId)) {
        return tabData[tabId].frames[frameId].url;
      }
    }
    return null;
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.type === 'main_frame' || details.type === 'sub_frame') {
            recordFrame(details.tabId, details.frameId, details.url);
            return {};
        }

        const tabUrl = getUrlForTab(details.tabId);

        if (tabUrl && tabUrl.endsWith('/anime')) {
            if (details.url.startsWith('https://www.neko-sama.fr/js/nekosama-libs.js'))
                return { redirectUrl: browser.runtime.getURL('vendors/nekosama-libs.js') };
        }

        return {};
    },
    { urls: ['*://*.neko-sama.fr/*'] },
    ['blocking']
);
