const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    app: './views/app.jsx',
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-router-dom',
      'react-redux',
      'axios',
    ],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../admin'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/admin/index.html',
      filename: 'index.html',
      favicon: './template/admin/favicon.ico',
    }),
    new webpack.optimize.SplitChunksPlugin({
      chunks: 'async',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
    }),
    new ExtractTextPlugin('[name].[hash].css'),
  ],
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.css|less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]-[local]__[hash:base64:8]',
              },
            },
            'less-loader',
          ],
        }),
        exclude: [/node_modules/, /global\.less/],
      },
      {
        test: /\.css|less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: [/node_modules/, /global\.less/],
      },
      {
        test: /\.jpg|png|jpeg|gif$/,
        use: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.styl'],
    alias: {
      '@': path.join(__dirname, '../views'),
    },
  },
}
