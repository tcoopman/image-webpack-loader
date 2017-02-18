const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminPngquant = require('imagemin-pngquant');
const loaderUtils = require('loader-utils');

module.exports = function(content) {
  const config = loaderUtils.getLoaderConfig(this, "imageWebpackLoader");
  const options = {
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

  const callback = this.async();
  let called = false;

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  }

  const plugins = [];
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
};

module.exports.raw = true;
