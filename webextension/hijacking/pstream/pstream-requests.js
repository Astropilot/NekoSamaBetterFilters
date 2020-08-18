async function hijackPStream() {
  let {adblock} = await optionsStorage.getAll();

  setInterval(async () => {
    ({adblock} = await optionsStorage.getAll());
  }, 3000);

  browser.webRequest.onBeforeRequest.addListener(
    () => {
      return {cancel: adblock};
    },
    {urls: ['*://*.myvidbid.ovh/*']},
    ['blocking']
  );
}

hijackPStream();
