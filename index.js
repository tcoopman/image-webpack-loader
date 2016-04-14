var Imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var loaderUtils = require('loader-utils');


module.exports = function(content) {
  this.cacheable && this.cacheable();

  var config = loaderUtils.getLoaderConfig(this, "imageWebpackLoader");
  var options = {
    interlaced: config.interlaced || false,
    progressive: config.progressive || false,
    optimizationLevel: config.optimizationLevel || 3,
    bypassOnDebug: config.bypassOnDebug || false,
    pngquant: config.pngquant || false,
    svgo: config.svgo || {}
  };

  var callback = this.async(), called = false;

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var imagemin = new Imagemin()
    .src(content)
    .use(Imagemin.gifsicle({
      interlaced: options.interlaced
    }))
    .use(Imagemin.jpegtran({
      progressive: options.progressive
    }))
    .use(Imagemin.svgo(options.svgo));

    if (options.pngquant) {
      imagemin.use(imageminPngquant(options.pngquant));
    } else {
      imagemin.use(Imagemin.optipng({
        optimizationLevel: options.optimizationLevel
      }));
    }

    imagemin.run(function(err, files) {
      if (called) {
        console.log("something is very odd, it is being called twice");
        return;
      }
      called = true;
      if (err) {
        callback(err);
      } else {
        callback(null, files[0].contents);
      }
    });
  }
};
module.exports.raw = true;
