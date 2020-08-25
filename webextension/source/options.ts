import {optionsStorage} from './options-storage';

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
              if (!response) {
                await optionsStorage.set({adblock: false});
                adblock.checked = false;
              }
            });
        } else {
          browser.permissions.remove({origins: perms});
        }
      });
    }
  })
  .catch(() => {
    console.log('Error while syncing form');
  });
