const base = require('./webpack.base.conf')
const path = require('path')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const config = require('../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { FileManager } = require('less')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
// if (config.bundleAnalyzerReport) {
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// 	base.plugins.push(new BundleAnalyzerPlugin())
// }
// process.env.SERVICE_URL = config.PROD_BASE_URL

module.exports = merge(base, {
  devtool: '#source-map',
  mode: 'production',
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CompressionWebpackPlugin({
      //gzip 压缩
      filename: "[path][base].gz",
      algorithm: 'gzip',
      test: productionGzipExtensions,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: '/',
        },
      ],
    })
  ],
  module: {
    rules: [],
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          //删除注释
          output: {
            comments: false,
          },
          //删除console 和 debugger  删除警告
          compress: false,
          // {
          //   // warnings: false,
          //   drop_debugger: true,
          //   drop_console: true,
          // },
        },
      }),
    ],
  },
})
