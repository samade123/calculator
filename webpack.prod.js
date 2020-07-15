var path = require('path');
const common = require("./webpack.common.js")
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");






module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash].css',
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new HtmlCriticalWebpackPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: false,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false,
      }
    })
  ],
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }],
      },
      canPrint: true
    }), new TerserPlugin({
      parallel: true,
      terserOptions: {
         output: {
           comments: false,
         },
       },
       extractComments: false,

    }), ],
  },
  output: {
    filename: '[name]-[contentHash].js',
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/i,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }, ],
  },
});
