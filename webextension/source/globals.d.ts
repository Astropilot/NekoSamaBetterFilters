declare module 'size-plugin';
declare module 'webpack-merge-and-include-globally';

interface Window { jQuery: any; }

declare module 'webextension-polyfill' {
  export = browser;
}
