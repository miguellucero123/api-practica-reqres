const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://reqres.in',
        changeOrigin: true,
        secure: true,
        headers: {
          'x-api-key': 'reqres_741ddb40f3c64ce497b391f2033848c9'
        }
      }
    }
  }
})
