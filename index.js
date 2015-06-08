var Imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var loaderUtils = require('loader-utils');


module.exports = function(content) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var options = {
    interlaced: query.interlaced || false,
    progressive: query.progressive || false,
    optimizationLevel: query.optimizationLevel || 3,
    bypassOnDebug: query.bypassOnDebug || false,
    pngquant: query.pngquant || false,
    svgo: query.svgo || {} 
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
    .use(Imagemin.optipng({
      optimizationLevel: options.optimizationLevel
    }))
    .use(Imagemin.svgo(options.svgo));

    if (options.pngquant) {
      imagemin.use(imageminPngquant(options.pngquant));
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
