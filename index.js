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
    interlaced: config.interlaced || false,
    optimizationLevel: config.optimizationLevel || 3,
    gifsicle: config.gifsicle || {},
    mozjpeg: config.mozjpeg || {},
    pngquant: config.pngquant || {},
    optipng: config.optipng || {},
    svgo: config.svgo || {}
  };
  // Remove line 15-16 and 23-39 in new major version
  if(config.gifsicle === undefined){
    options.gifsicle.interlaced = options.interlaced;
	  this.emitWarning("DEPRECATED. Configure gifsicles interlaced option in it's own options. (gifsicle.interlaced)")
  } else {
 	  if(config.hasOwnProperty('interlaced')){
	    this.emitWarning("DEPRECATED. Configure gifsicles interlaced option in it's own options. (gifsicle.interlaced)")
 	  }
  }
  if(config.optipng === undefined){
    options.optipng.optimizationLevel = options.optimizationLevel;
	  this.emitWarning("DEPRECATED. Configure optipngs optimizationLevel option in it's own options. (optipng.optimizationLevel)")
  } else {
  	if(config.hasOwnProperty('optimizationLevel')){
	    this.emitWarning("DEPRECATED. Configure optipngs optimizationLevel option in it's own options. (optipng.optimizationLevel)")
    }
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