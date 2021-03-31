const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const webpack = require('webpack')

module.exports = merge(base, {
	devtool: 'inline-source-map',
	mode: 'development',
	output: {
	},
	devServer: {
		port: 9333,
		proxy:{
			"/api": {
				target: "http://localhost:8030/",
				changeOrigin: true,
				pathRewrite: {"^/api" : "/api"}
			}
		}
	}
})