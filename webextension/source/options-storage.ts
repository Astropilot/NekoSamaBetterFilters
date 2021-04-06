import OptionsSync from 'webext-options-sync';

export const optionsStorage = new OptionsSync({
  defaults: {
    volume: 100,
    streamResolution: '1080'
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ],
  logging: true
});
