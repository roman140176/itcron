// postcss.config.js
import pxToViewport from 'postcss-px-to-viewport-8-plugin';

export default {
  plugins: [
    pxToViewport({
      viewportWidth: 2120,
      unitToConvert: 'px',
      unitPrecision: 5,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 0,
      mediaQuery: true,
      replace: true,
      exclude: [/node_modules/],
      landscape: false,
      landscapeUnit: 'vw',
      landscapeWidth: 568,
      propList:['*']
    })
  ]
};
