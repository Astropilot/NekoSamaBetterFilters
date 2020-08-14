browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        return { cancel: true };
    },
    { urls: ['*://*.inpagepush.com/*'] },
    ['blocking']
);
