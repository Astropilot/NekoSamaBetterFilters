import OptionsSync from 'webext-options-sync';

export const optionsStorage = new OptionsSync({
  defaults: {
    adblock: false
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ],
  logging: false
});
