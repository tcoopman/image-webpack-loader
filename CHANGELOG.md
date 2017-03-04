# Change Log
All notable changes to this project will be documented in this file.

## [3.3.0] - 2017-03-04
### Changed
- Added jpegtran due to EXIF stripping (disabled by default).
See [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran) for configuration options.

## [3.0.0] - 2016-10-16
### Changed
- Changed jpeg compression algorithm from jpegtran to mozjpeg [PR#38](https://github.com/tcoopman/image-webpack-loader/pull/38).
See [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) for configuration options. 
- Updated minor versions of dependencies: `loader-utils`, `imagemin-gifsicle`,  `imagemin-optipng`, `imagemin-svgo`, `webpack`