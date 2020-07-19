var path = require('path');
const common = require("./webpack.common.js")
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");
var WebpackPwaManifest = require('webpack-pwa-manifest')
const {GenerateSW} = require('workbox-webpack-plugin');







module.exports = merge(common, {
  mode: "production",
  plugins: [
    new WebpackPwaManifest({
    name: 'Calculator',
    short_name: 'Calc',
    description: 'Basic Calculator App',
    start_url: 'https://calculator-sigma.vercel.app/',
    background_color: '#1A1D1F',
    theme_color: '#1A1D1F',
    crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    icons: [
      {
        src: path.resolve('src/images/calculator-line.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      },
    ]
  }),
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
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
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
