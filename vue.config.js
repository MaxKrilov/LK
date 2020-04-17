module.exports = {
  transpileDependencies: ['vue-loading-skeleton'],
  css: {
    loaderOptions: {
      sass: {
        data: '@import "~@/assets/scss/_import.scss";'
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .options({})

    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader')
      .tap(options => {
        return {
          plugins: [
            { collapseGroups: true },
            { removeUselessStrokeAndFill: { removeNone: true } },
            { convertColors: { currentColor: true } }
          ]
        }
      })
  }
}
