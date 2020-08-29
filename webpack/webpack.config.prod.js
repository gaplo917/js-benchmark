const Webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {},
          mangle: {
            properties: {
              regex: /^_|_$|^ktFilterNotEmpty$|^ktMapNotNull$|^ktSum$|^ktMap$/,
            },
          },
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
  output: {
    filename: 'js/[name].js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin(),
  ],
})
