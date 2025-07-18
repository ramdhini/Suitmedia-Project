const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'), 
    },
    port: 3000,
    open: true,
    historyApiFallback: true,

    proxy: [
      {
        context: ['/api'], 
        target: 'https://suitmedia-backend.suitdev.com',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug', 
      },
    ],
  },
});