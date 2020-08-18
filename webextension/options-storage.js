import OptionsSync from 'webext-options-sync';

window.optionsStorage = new OptionsSync({
  defaults: {
    adblock: false
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ]
});
