const { defineConfig } = require('@vue/cli-service');
const Webpack = require('webpack');
// 分析打包时间
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pages: {
    management: {
      entry: `src/management/main.js`,
      template: 'public/management.html',
      filename: `management.html`,
      title: '问卷调研',
    },
    render: {
      entry: `src/render/main.js`,
      template: 'public/render.html',
      filename: `render.html`,
      title: '问卷调研',
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "./src/management/styles/variable.scss";`,
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/', function (req, res) {
        res.redirect('/management');
      });
      return middlewares;
    },
    open: true,
  },
  configureWebpack: {
    plugins: [
      new Webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .test(/\.jsx?$/)
      .exclude.add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end();

    config.optimization.splitChunks({
      cacheGroups: {
        setterWidgets: {
          name: 'chunk-setterWidgets',
          test: /\/materials\/setters[\\/]/,
          chunks: 'async',
          enforce: true,
        },
        materialWidgets: {
          name: 'chunk-materialWidgets',
          test: /\/materials\/questions[\\/]/,
          chunks: 'async',
          enforce: true,
        },
        commonEditor: {
          name: 'chunk-commonEditor',
          test: /\/common\/Editor[\\/]/,
          enforce: true,
        },
        element: {
          name: 'chunk-element-ui',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        moment: {
          name: 'chunk-moment',
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        '@wangeditor': {
          name: 'chunk-wangeditor',
          test: /[\\/]node_modules[\\/]@wangeditor[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        common: {
          //抽取所有入口页面都需要的公共chunk
          name: 'chunk-common',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    });
    config.plugin('speed').use(SpeedMeasureWebpackPlugin);
  },
});
