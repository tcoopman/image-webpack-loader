const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const loaderUtils = require('loader-utils');

/**
 * Basically the getLoaderConfig() function from loader-utils v0.2.
 */
function getLegacyLoaderConfig(loaderContext, defaultConfigKey) {
  const options = loaderUtils.getOptions(loaderContext);
  const configKey = options ? options.config : defaultConfigKey;
  
  if (configKey) {
    return Object.assign({}, options, loaderContext.options[configKey]);
  }

  return options;
}

module.exports = function (content) {
  this.cacheable && this.cacheable();

  let config = this.version === 2 ?
    loaderUtils.getOptions(this)
    : getLegacyLoaderConfig(this, 'imageWebpackLoader');

  if (config === null) {
    // handle the cases in which loaderUtils.getOptions() returns null
    // see https://github.com/webpack/loader-utils#getoptions
    config = {};
  }

  const defaults = {
    bypassOnDebug: false,
    gifsicle: {},
    mozjpeg: {},
    pngquant: {},
    optipng: {},
    svgo: {},
    webp: null,
  };

  const options = Object.assign(defaults, config);

  // Remove in interlaced, progressive and optimizationLevel checks in new major version
  if (config.hasOwnProperty('interlaced')) {
    options.gifsicle.interlaced = config.interlaced;
    this.emitWarning("DEPRECATED. Configure gifsicle's interlaced option in its own options. (gifsicle.interlaced)");
  }

  if (config.hasOwnProperty('progressive')) {
    options.mozjpeg.progressive = config.progressive;
    this.emitWarning("DEPRECATED. Configure mozjpeg's progressive option in its own options. (mozjpeg.progressive)");
  }

  if (config.hasOwnProperty('optimizationLevel')) {
    options.optipng.optimizationLevel = config.optimizationLevel;
    this.emitWarning("DEPRECATED. Configure optipng's optimizationLevel option in its own options. (optipng.optimizationLevel)");
  }

  const callback = this.async();

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  }
  const plugins = [];
  // default optimizers
  if (options.gifsicle.enabled) { plugins.push(imageminGifsicle(options.gifsicle)); }
  if (options.mozjpeg.enabled) { plugins.push(imageminMozjpeg(options.mozjpeg)); }
  if (options.svgo.enabled) { plugins.push(imageminSvgo(options.svgo)); }
  if (options.pngquant.enabled) { plugins.push(imageminPngquant(options.pngquant)); }
  if (options.optipng.enabled) { plugins.push(imageminOptipng(options.optipng)); }
  // optional optimizers
  if (options.webp) { plugins.push(imageminWebp(options.webp)); }

  imagemin
    .buffer(content, { plugins })
    .then(data => callback(null, data))
    .catch(err => callback(err));
};

module.exports.raw = true;
