const { defineConfig } = require('@vue/cli-service');

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
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .test(/\.jsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end();

    config.optimization.splitChunks({
      cacheGroups: {
        setterWidgets: {
          name: 'setterWidgets',
          test: /\/setters\/src\/widgets[\\/]/,
          chunks: 'async',
          enforce: true,
        },
        materialWidgets: {
          name: 'materialWidgets',
          test: /\/materials\/questions\/widgets[\\/]/,
          chunks: 'async',
          enforce: true,
        },
      },
    });
  },
});
