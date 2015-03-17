# image-loader

Image loader module for webpack

> Minify PNG, JPEG, GIF and SVG images with [imagemin](https://github.com/kevva/imagemin)

*Issues with the output should be reported on the imagemin [issue tracker](https://github.com/kevva/imagemin/issues).*

## Install

```sh
$ npm install image-webpack-loader --save-dev
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

in you _webpack.config.js_ add the _image_ loader, chained with the [file-loader](https://github.com/webpack/file-loader).

``` javascript
loaders: [
    {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
    }
]
```


Comes bundled with the following optimizers:

- [gifsicle](https://github.com/kevva/imagemin-gifsicle) — *Compress GIF images*
- [jpegtran](https://github.com/kevva/imagemin-jpegtran) — *Compress JPEG images*
- [optipng](https://github.com/kevva/imagemin-optipng) — *Compress PNG images*
- [svgo](https://github.com/kevva/imagemin-svgo) — *Compress SVG images*

### imagemin(options)

Unsupported files are ignored.

### options

Options are applied to the correct files.

#### optimizationLevel *(png)*

Type: `number`  
Default: `3`

Select an optimization level between `0` and `7`.

> The optimization level 0 enables a set of optimization operations that require minimal effort. There will be no changes to image attributes like bit depth or color type, and no recompression of existing IDAT datastreams. The optimization level 1 enables a single IDAT compression trial. The trial chosen is what. OptiPNG thinks it’s probably the most effective. The optimization levels 2 and higher enable multiple IDAT compression trials; the higher the level, the more trials.

Level and trials:

1. 1 trial
2. 8 trials
3. 16 trials
4. 24 trials
5. 48 trials
6. 120 trials
7. 240 trials

#### progressive *(jpg)*

Type: `boolean`  
Default: `false`

Lossless conversion to progressive.

#### interlaced *(gif)*

Type: `boolean`  
Default: `false`

Interlace gif for progressive rendering.

#### svgoPlugins *(svg)*

Type: `array`
Default: `[]`

No plugins implemented at the moment.

#### bypassOnDebug *(all)*

Type: `boolean`  
Default: `false`

Using this, no processing is done when webpack 'debug' mode is used and the loader acts as a regular file-loader. Use this to speed up initial and, to a lesser extent, subsequent compilations while developing or using webpack-dev-server. Normal builds are processed normally, outputting oprimized files.

## Inspiration

* [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
* [file-loader](https://github.com/webpack/file-loader)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
