const FontminPlugin = require('fontmin-webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack')
const _ = require('lodash')
const VERSION = '1.0.0'
const BUILD_TYPE = 'PROD'
let config = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        VERSION: "'" + VERSION +"'",
        BUILD_TYPE: "'" + BUILD_TYPE +"'",
      }),
      new FontminPlugin({
        autodetect: true, // automatically pull unicode characters from CSS
        glyphs: [/* extra glyphs to include */],
      }),
      new CaseSensitivePathsPlugin(),
      new LodashModuleReplacementPlugin({
        shorthands: true,
        paths: true,
        collections: true,
        coercions: true
      })
    ]
  }
}

if(process.env.NODE_ENV === 'production') {
  config = _.merge(config, {
    outputDir: 'dist/' + VERSION,
    publicPath: "/",
    productionSourceMap: false,
    configureWebpack: {
      optimization: {
        minimizer: [
          new TerserPlugin({
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              compress: {
                drop_console: false,
              },
            },
          }),
        ],
      },
    }
  })
}
module.exports = config