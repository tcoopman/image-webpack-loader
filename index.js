var imagemin = require('imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminPngquant = require('imagemin-pngquant');
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

/**
 * Basically the getLoaderConfig() function from loader-utils v0.2.
 */
function getLegacyLoaderConfig(loaderContext, defaultConfigKey) {
  var options = loaderUtils.getOptions(loaderContext);
  var configKey = options ? options.config : defaultConfigKey;
  if (configKey) {
    return assign({}, options, loaderContext.options[configKey]);
  }
  return options;
}

module.exports = function(content) {
  this.cacheable && this.cacheable();

  var config = this.version === 2 ?
    loaderUtils.getOptions(this)
    : getLegacyLoaderConfig(this, "imageWebpackLoader");

  if (config === null) {
    // handle the cases in which loaderUtils.getOptions() returns null
    // see https://github.com/webpack/loader-utils#getoptions
    config = {}
  }

  var options = {
    bypassOnDebug: config.bypassOnDebug || false,
    gifsicle: config.gifsicle || {},
    mozjpeg: config.mozjpeg || {},
    pngquant: config.pngquant || {},
    optipng: config.optipng || {},
    svgo: config.svgo || {}
  };
  // Remove in interlaced and optimizationLevel checks in new major version
  if (config.hasOwnProperty('interlaced')) {
    options.gifsicle.interlaced = config.interlaced;
    this.emitWarning("DEPRECATED. Configure gifsicle's interlaced option in its own options. (gifsicle.interlaced)");
  }
  if (config.hasOwnProperty('optimizationLevel')) {
    options.optipng.optimizationLevel = config.optimizationLevel;
    this.emitWarning("DEPRECATED. Configure optipng's optimizationLevel option in its own options. (optipng.optimizationLevel)");
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
