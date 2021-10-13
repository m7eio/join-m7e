const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  // modifyVars: { '@primary-color': '#04f' },
  // optional
  lessVarsFilePath: './styles/antd.less',
  // optional
  // lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // i18n: {
  //   locales: ['zh-CN', 'en-US'],
  //   defaultLocale: 'en-US',
  // },
  images: {
    domains: ['static.ghost.org'],
  },
});
