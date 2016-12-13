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
    gifsicle: config.gifsicle || {},
    mozjpeg: config.mozjpeg || {},
    pngquant: config.pngquant || {},
    optipng: config.optipng || {},
    svgo: config.svgo || {}
  };
  // Remove in interlaced adn optimizationLevel checks in new major version
  if (config.hasOwnProperty('interlaced')) {
    options.gifsicle.interlaced = config.interlaced;
    this.emitWarning("DEPRECATED. Configure gifsicle's interlaced option in it's own options. (gifsicle.interlaced)");
  }
  if (config.hasOwnProperty('optimizationLevel')) {
    options.optipng.optimizationLevel = config.optimizationLevel;
    this.emitWarning("DEPRECATED. Configure optipng's optimizationLevel option in it's own options. (optipng.optimizationLevel)");
  }

  var callback = this.async(),
    called = false;

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var plugins = [];
    if(options.gifsicle.enabled !== false)
      plugins.push(imageminGifsicle(options.gifsicle));
    if(options.mozjpeg.enabled !== false)
      plugins.push(imageminMozjpeg(options.mozjpeg));
    if(options.svgo.enabled !== false)
      plugins.push(imageminSvgo(options.svgo));
    if(options.pngquant.enabled !== false)
      plugins.push(imageminPngquant(options.pngquant));
    if(options.optipng.enabled !== false)
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