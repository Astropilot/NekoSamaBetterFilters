const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  devtool: false,
  stats: 'errors-only',
  entry: Object.fromEntries([
    'options-storage'
  ].map(name => [name, `./webextension/${name}`])),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2 // eslint-disable-line camelcase
          }
        }
      })
    ]
  }
};
