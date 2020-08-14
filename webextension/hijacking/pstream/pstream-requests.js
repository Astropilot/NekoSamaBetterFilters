browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        return { cancel: true };
    },
    { urls: ['*://*.myvidbid.ovh/*'] },
    ['blocking']
);
