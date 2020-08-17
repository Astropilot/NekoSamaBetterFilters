const {
    src,
    dest,
    series,
    watch
} = require('gulp');

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const babel = require('gulp-babel');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const DIST_FOLDER = './dist';

function clear() {
    return src('./dist/*', {
        read: false
    })
        .pipe(clean());
}

function copyFiles() {
    const sources = [
        './webextension/animes/**/*.*',
        './webextension/hijacking/**/*.*',
        './webextension/icons/**/*.*',
        './webextension/vendors/nprogress/*.*',
        './webextension/vendors/*.*',
        './webextension/*.*'
    ];

    return src(sources, {base: './webextension/'})
        .pipe(changed(DIST_FOLDER))
        .pipe(dest(DIST_FOLDER));
}

function copyNodeModulesFiles() {
    return src([
        'node_modules/webextension-polyfill/dist/browser-polyfill.js',
        'node_modules/webext-base-css/webext-base.css'
    ]).pipe(dest('./dist/vendors'));
}

function webpackOptionsStorage() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }

            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }

            resolve();
        });
    });
}

function bundleNekoLibs() {
    return src([
        './webextension/vendors/nekosama-libs/jquery*.js',
        './webextension/vendors/nekosama-libs/*.js'
    ])
        .pipe(concat('nekosama-libs.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./dist/vendors'));
}

function transpileJs() {
    const sources = [
        './dist/animes/**/*.js',
        './dist/hijacking/**/*.js',
        './dist/*.js'
    ];

    return src(sources, {base: DIST_FOLDER})
        .pipe(changed('./webextension'))
        .pipe(babel())
        .pipe(dest(DIST_FOLDER));
}

function watchFiles() {
    watch('./webextension/**/*', series(copyFiles, transpileJs));
}

exports.watch = watchFiles;
exports.default = series(clear, copyFiles, webpackOptionsStorage, bundleNekoLibs, copyNodeModulesFiles, transpileJs);
