'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    entry: './test/app.js',
    output: {
      path: path.join(__dirname, 'public/assets'),
      filename: 'app.[hash].js'
    },
    module: {
      rules: [
        { 
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
              loader: path.resolve(__dirname, '..', 'index.js'),
              options: {
                optimizationLevel: 7,
                mozjpeg: {
                  quality: 65
                },
                pngquant: {
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
                interlaced:false
              }
            }
          ]
        }
      ]
    }
  }
];
