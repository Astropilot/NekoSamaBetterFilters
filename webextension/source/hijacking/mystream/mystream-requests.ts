import {optionsStorage} from '../../options-storage';

const AD_URL = ['*://*.inpagepush.com/*'];
let adblock: boolean;
let oldAdblock = false;

function requestHandler() {
  return {cancel: adblock};
}

async function hijackMyStream() {
  setInterval(async () => {
    ({adblock} = await optionsStorage.getAll());

    adblock = adblock && await browser.permissions.contains({
      origins: AD_URL
    });

    if (adblock && adblock !== oldAdblock) {
      console.log('Add handler for mystream');
      browser.webRequest.onBeforeRequest.addListener(
        requestHandler,
        {urls: AD_URL},
        ['blocking']
      );
    } else if (!adblock && adblock !== oldAdblock) {
      console.log('Remove handler for mystream');
      browser.webRequest.onBeforeRequest.removeListener(requestHandler);
    }

    oldAdblock = adblock;
  }, 3000);
}

hijackMyStream();
