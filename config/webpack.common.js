
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
     
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, 
        type: 'asset/resource', 
        generator: {
          filename: 'images/[name][ext][query]', 
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
    }),
    new CopyPlugin({ 
      patterns: [
        { from: 'src/_redirects', to: '_redirects' }, 
      ],
    }),
],
};