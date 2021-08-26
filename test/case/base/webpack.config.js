const { initYylBaseConfig } = require('yyl-base-webpack-config')
const { merge } = require('webpack-merge')
module.exports = (env) => {
  return merge(
    initYylBaseConfig({
      env
    }),
    {
      devServer: {
        noInfo: false,
        open: true,
        openPage: '/html/index.html'
      }
    }
  )
}
