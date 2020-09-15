import OptionsSync from 'webext-options-sync';

export const optionsStorage = new OptionsSync({
  defaults: {
    volume: 100,
    streamResolution: '480|pstream'
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ],
  logging: true
});
