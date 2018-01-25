const path = require('path');

const assetsPath = path.join(__dirname, 'public/assets');

const loaderOptions = {
  mozjpeg: {
    quality: 65,
  },
  pngquant: {
    quality: '65-90',
    speed: 4,
  },
  svgo: {
    plugins: [
      {
        removeViewBox: false,
      },
      {
        removeEmptyAttrs: false,
      },
    ],
  },
  gifsicle: {
    optimizationLevel: 7,
    interlaced: false,
  },
  optipng: {
    optimizationLevel: 7,
    interlaced: false,
  },
  webp: {
    quality: 75,
  },
};

const fileLoaderOptions = {
  hash: 'sha512',
  digest: 'hex',
  name: '[hash].[ext]',
};

module.exports = [
  {
    entry: './test/app.js',
    output: {
      path: assetsPath,
      filename: 'app.[hash].js',
    },
    module: {
      rules: [{
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: fileLoaderOptions,
          },
          {
            loader: require.resolve('../'),
            options: loaderOptions,
          },
        ],
      }, {
        test: /\.bmp$/i,
        use: [
          {
            loader: 'file-loader',
            options: fileLoaderOptions,
          },
          require.resolve('../'), // loaderUtils.getOptions() returns null for this one
        ],
      }],
    },
  },
];
