var path = require('path');

var Imagemin = require('imagemin');
var loaderUtils = require('loader-utils');


module.exports = function(content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile) throw new Error("emitFile is required from module system");

  var query = loaderUtils.parseQuery(this.query);
  var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
    context: query.context || this.options.context,
    content: content,
    regExp: query.regExp
  });
  var options = {
    interlaced: query.interlaced || false,
    progressive: query.progressive || false,
    optimizationLevel: query.optimizationLevel || 3,
    bypassOnDebug: query.bypassOnDebug || false
  }

  if (this.debug === true && options.bypassOnDebug === true) {
    // Bypass processing while on wathch mode
    this.emitFile(url, content);
    return "module.exports = __webpack_public_path__ + " + JSON.stringify(url);
  } else {
    var callback = this.async(), called = false;

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
    .use(Imagemin.svgo());

    imagemin.run(function(err, files) {
      if (called) {
        console.log("something is very odd, it is being called twice");
        return;
      }
      called = true;
      if (err) {
        return callback(err);
      }
      this.emitFile(url, files[0].contents);
      callback(null, "module.exports = __webpack_public_path__ + " + JSON.stringify(url));
    }.bind(this));
  }
};
module.exports.raw = true;
