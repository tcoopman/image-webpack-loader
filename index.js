var path = require('path');

var Imagemin = require('imagemin');
var loaderUtils = require('loader-utils');


module.exports = function(content) {
  this.cacheable && this.cacheable();
  if(!this.emitFile) throw new Error("emitFile is required from module system");

  var callback = this.async();

  var name = path.basename(this.resourcePath);

  var query = loaderUtils.parseQuery(this.query);
  var options = {
    interlaced: query.interlaced || false,
    progressive: query.progressive || false,
    optimizationLevel: query.optimizationLevel || 3
  }

  var imagemin = new Imagemin()
    .src(content)
    .use(Imagemin.gifsicle({interlaced: options.interlaced}))
		.use(Imagemin.jpegtran({progressive: options.progressive}))
		.use(Imagemin.optipng({optimizationLevel: options.optimizationLevel}));

  imagemin.optimize(function (err, data) {
    if (err) {
      return callback(err);
    }

    callback(null, data.contents);
  }.bind(this));
};
module.exports.raw = true;
