module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px',          // 需要转换的单位
      viewportWidth: 375,           // 设计稿宽度（AntD Mobile 默认是 375）
      unitPrecision: 6,             // 转换后精度
      propList: ['*'],              // 需要转换的属性
      viewportUnit: 'vw',           // 转换成 vw
      fontViewportUnit: 'vw',       // 字体使用的单位
      selectorBlackList: ['ignore-'], // 忽略的类名（比如 .ignore-button 不转换）
      minPixelValue: 1,             // 小于或等于 1px 不转换
      mediaQuery: false,            // 是否转换媒体查询里的 px
      replace: true,                // 是否直接替换属性值
      exclude: [],                  // 不排除任何目录，包括 antd-mobile 也会转换
    },
  },
};
