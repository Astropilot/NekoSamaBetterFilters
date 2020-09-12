import {optionsStorage} from '../../options-storage';

let adblock = false;

function requestHandler() {
  return {cancel: adblock};
}

browser.webRequest.onBeforeRequest.addListener(
  requestHandler,
  {urls: ['*://*.inpagepush.com/*']},
  ['blocking']
);

browser.runtime.onMessage.addListener(message => {
  if (Object.prototype.hasOwnProperty.call(message, 'adblock')) {
    adblock = message.adblock;
  }
});

(async () => {
  ({adblock} = await optionsStorage.getAll());
})();
