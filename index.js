var imagemin = require('imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminPngquant = require('imagemin-pngquant');
var loaderUtils = require('loader-utils');

module.exports = function(content) {
  this.cacheable && this.cacheable();

  var config = loaderUtils.getLoaderConfig(this, "imageWebpackLoader");
  var options = {
    bypassOnDebug: config.bypassOnDebug || false,
    gifsicle: config.gifsicle || false,
    mozjpeg: config.mozjpeg || false,
    pngquant: config.pngquant || false,
    optipng: config.optipng || false,
    svgo: config.svgo || false
  };

  var callback = this.async(),
    called = false;

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var plugins = [];
    plugins.push(imageminGifsicle(options.gifsicle));
    plugins.push(imageminMozjpeg(options.mozjpeg));
    plugins.push(imageminSvgo(options.svgo));
    plugins.push(imageminPngquant(options.pngquant));
    plugins.push(imageminOptipng(options.optipng));

    imagemin
      .buffer(content, {
        plugins
      })
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        callback(err);
      });
  }
};

module.exports.raw = true;
