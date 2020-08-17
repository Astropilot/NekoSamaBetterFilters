import OptionsSync from 'webext-options-sync';

window.optionsStorage = new OptionsSync({
    defaults: {
        antipub: false
    },
    migrations: [
        OptionsSync.migrations.removeUnused
    ]
});
