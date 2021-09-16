import * as browser from 'webextension-polyfill';

/* Neko-Sama Requests */

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
      if (details.url.startsWith('https://neko-sama.fr/js/nekosama-libs.js')) {
        return {
          cancel: true
        };
      }
    }

    return {};
  },
  { urls: ['*://*.neko-sama.fr/*'] },
  ['blocking']
);

browser.webRequest.onHeadersReceived.addListener(
  details => {
    let foundAllowOrigin = false;
    let foundAllowHeaders = false;
    details.responseHeaders?.map(item => {
      if (item.name.toLowerCase() === 'access-control-allow-origin') {
        item.value = '*';
        foundAllowOrigin = true;
      } else if (item.name.toLowerCase() === 'access-control-allow-headers') {
        item.value = '*';
        foundAllowHeaders = true;
      }
    });
    if (!foundAllowHeaders)
      details.responseHeaders?.push({name: 'Access-Control-Allow-Headers', value: '*'});

    if (!foundAllowOrigin)
      details.responseHeaders?.push({name: 'Access-Control-Allow-Origin', value: '*'});

    return {responseHeaders: details.responseHeaders};
  },
  { urls: ['*://*.pstream.net/*', '*://*.gcdn.me/*']},
  ['responseHeaders', 'blocking']
);

browser.webRequest.onBeforeSendHeaders.addListener(
  details => {
    if (!details.url.startsWith('https://www.pstream.net/e/')) {
      let foundOrigin = false;
      let foundReferer = false;
      details.requestHeaders?.map(item => {
        if (item.name.toLowerCase() === 'origin') {
          item.value = 'https://www.pstream.net';
          foundOrigin = true;
        } else if (item.name.toLowerCase() === 'referer') {
          item.value = 'https://www.pstream.net/e/lR7yP4kWB5GnVBJ';
          foundReferer = true;
        }
      });
      if (!foundOrigin)
        details.requestHeaders?.push({ name: 'Origin', value: 'https://www.pstream.net' });

      if (!foundReferer)
        details.requestHeaders?.push({ name: 'Referer', value: 'https://www.pstream.net/e/lR7yP4kWB5GnVBJ' });
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['*://*.pstream.net/*', '*://*.gcdn.me/*'] },
  ['requestHeaders', 'blocking']
);
