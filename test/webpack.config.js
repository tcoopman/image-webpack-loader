'use strict';
var path = require('path');
var webpack = require('webpack');

var commonLoaders = [
  {test: /.*\.(gif|png|jpg|svg)$/, loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]', '../index.js?progressive=true&optimizationLevel=7&interlaced=false']},
];
var assetsPath = path.join(__dirname, 'public/assets');
var publicPath = 'assets/';
var extensions = ['', '.js', '.jsx', '.styl'];

module.exports = [
  {
    name: 'browser',
    entry: './test/app.js',
    output: {
      path: assetsPath,
      publicPath: publicPath,
      filename: 'app.[hash].js'
    },
    resolve: {
      extensions: extensions
    },
    module: {
      loaders: commonLoaders
    }
  }
];
