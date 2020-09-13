/// <reference types="./source/globals" />

import path from 'path';

import {Configuration} from 'webpack';
import SizePlugin from 'size-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: Configuration = {
  devtool: 'source-map',
  stats: {
    all: false,
    errors: true,
    builtAt: true
  },
  entry: Object.fromEntries([
    'nekosama/anime/anime-info',
    'nekosama/episode/anime-episode',
    'nekosama/search/better-filters',
    'nekosama/search/hijack-js',
    'hosts/mystream/mystream-overlay',
    'hosts/pstream/pstream-overlay',
    'options/options',
    'background',
    'web-request'
  ].map(name => [name, `./source/${name}`])),
  output: {
    path: path.join(__dirname, 'distribution'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'es2015'
          }
        },
        exclude: /node_modules/
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery']
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'source',
          globOptions: {
            ignore: [
              '**/*.js',
              '**/*.ts'
            ]
          }
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: './webext-base-css/webext-base.css', to: './vendors/webext-base.css', context: 'node_modules'},
        {from: './nprogress/nprogress.css', to: './vendors/nprogress.css', context: 'node_modules'},
        {from: './webextension-polyfill/dist/browser-polyfill.js', to: './vendors/browser-polyfill.js', context: 'node_modules'},
        {from: './webextension-polyfill/dist/browser-polyfill.js.map', to: './vendors/browser-polyfill.js.map', context: 'node_modules'}
      ]
    }),
    new SizePlugin({
      writeFile: false
    })
  ],
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ],
    modules: ['node_modules']
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        exclude: 'browser-polyfill.min.js',
        terserOptions: {
          mangle: false,
          compress: {
            defaults: false,
            dead_code: true,
            unused: true,
            arguments: true,
            join_vars: false,
            booleans: false,
            expression: false,
            sequences: false
          },
          output: {
            beautify: true,
            indent_level: 2
          }
        }
      })
    ]
  }
};

export default config;
