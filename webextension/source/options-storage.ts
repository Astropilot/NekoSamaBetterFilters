import OptionsSync from 'webext-options-sync';

export const optionsStorage = new OptionsSync({
  defaults: {
    adblock: false,
    streamResolution: '480'
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ],
  logging: true
});
