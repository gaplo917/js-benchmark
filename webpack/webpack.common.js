const Path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require('glob')

const entries = glob.sync('./src/generated/*.js').reduce(
  (acc, e) => ({
    ...acc,
    [Path.basename(e).split('.').slice(0, -1).join('.')]: e,
  }),
  {},
)
module.exports = {
  entry: entries,
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }],
    }),
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
}
