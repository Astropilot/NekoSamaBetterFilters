async function hijackMyStream() {
  let {adblock} = await optionsStorage.getAll();

  setInterval(async () => {
    ({adblock} = await optionsStorage.getAll());
  }, 3000);

  browser.webRequest.onBeforeRequest.addListener(
    () => {
      return {cancel: adblock};
    },
    {urls: ['*://*.inpagepush.com/*']},
    ['blocking']
  );
}

hijackMyStream();
