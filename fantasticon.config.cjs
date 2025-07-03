const path = require('path');

module.exports = {
  inputDir: path.resolve(__dirname, 'src/assets/icons'),
  outputDir: path.resolve(__dirname, 'src/assets/fonts'),
  fontTypes: ['woff', 'woff2'],
  assetTypes: ['css'],
  name: 'iconfont',
  prefix: 'icon',
  fontsUrl: '../fonts',
};
