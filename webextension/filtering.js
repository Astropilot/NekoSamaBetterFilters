/*******************************************************************************
* PROJECT: Neko-Sama Better Filters
*
* AUTHORS: Yohann Martin
*
* DATE: 2020
*
* Copyright (c) 2019 Yohann MARTIN (@Astropilot). All rights reserved.
*
* Licensed under the MIT License. See LICENSE file in the project root for full
* license information.
*******************************************************************************/

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

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.type === 'main_frame' || details.type === 'sub_frame') {
            recordFrame(details.tabId, details.frameId, details.url);
            return {};
        }

        const tabUrl = getUrlForTab(details.tabId);

        if (tabUrl && tabUrl === 'https://www.neko-sama.fr/anime') {
            if (details.url.includes('https://www.neko-sama.fr/js/nekosama-libs.js'))
                return { redirectUrl: chrome.runtime.getURL('nekosama-libs.js') };
        }

        return {};
    },
    { urls: ['*://*.neko-sama.fr/*'] },
    ['blocking']
);
