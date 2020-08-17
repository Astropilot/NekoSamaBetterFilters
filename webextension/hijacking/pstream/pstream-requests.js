async function hijackPStream() {
    let {antipub} = await optionsStorage.getAll();

    setInterval(async () => {
        ({antipub} = await optionsStorage.getAll());
    }, 3000);

    browser.webRequest.onBeforeRequest.addListener(
        () => {
            return {cancel: antipub};
        },
        {urls: ['*://*.myvidbid.ovh/*']},
        ['blocking']
    );
}

hijackPStream();
