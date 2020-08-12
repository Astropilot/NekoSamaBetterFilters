chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab && request.block == 'libs')
        var test = chrome.webRequest.onBeforeRequest.addListener(
            function(details) { browser.webRequest.onBeforeRequest.removeListener(test); return {cancel: true}; },
            { urls: ['*://*.neko-sama.fr/js/nekosama-libs.js*'] },
            ['blocking']
        );
    });
