import {optionsStorage} from '../options-storage';

const perms = [
  '*://*.inpagepush.com/*',
  '*://*.myvidbid.ovh/*',
  '*://*.fbpopr.com/*'
];

optionsStorage.syncForm('form')
  .then(() => {
    const adblock: HTMLInputElement|null = document.querySelector('input[name="adblock"]');

    if (adblock) {
      adblock.addEventListener('change', () => {
        if (adblock.checked) {
          browser.permissions.request({origins: perms})
            .then(async response => {
              if (response) {
                browser.runtime.sendMessage({adblock: true});
              } else {
                await optionsStorage.set({adblock: false});
                adblock.checked = false;
                browser.runtime.sendMessage({adblock: false});
              }
            });
        } else {
          browser.permissions.remove({origins: perms});
          browser.runtime.sendMessage({adblock: false});
        }
      });
    }
  })
  .catch(() => {
    console.log('Error while syncing form');
  });
