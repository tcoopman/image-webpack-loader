'use strict';
var path = require('path');
var webpack = require('webpack');

var assetsPath = path.join(__dirname, 'public/assets');

var loaderOptions = {
  mozjpeg: {
    quality: 65
  },
  pngquant:{
    quality: "65-90",
    speed: 4
  },
  svgo:{
    plugins: [
      {
        removeViewBox: false
      },
      {
        removeEmptyAttrs: false
      }
    ]
  },
  gifsicle: {
    optimizationLevel: 7,
    interlaced: false
  },
  optipng: {
    optimizationLevel: 7,
    interlaced: false
  }
}

module.exports = [
  {
    entry: './test/app.js',
    output: {
      path: assetsPath,
      filename: 'app.[hash].js'
    },
    module: {
      rules: [{
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]'
            }
          },
          {
            loader: require.resolve('../'),
            options: loaderOptions
          }
        ]
      }]
    }
  }
];
