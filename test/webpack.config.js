'use strict';
var path = require('path');
var webpack = require('webpack');

var commonLoaders = [
  {test: /.*\.(gif|png|jpg)$/, loaders: ['file?hash=sha512&digest=hex&size=16&name=[hash].[ext]', '../index.js?optimizationLevel=7&interlaced=false']},
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
