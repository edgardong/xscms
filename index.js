var fs = require('fs');
var babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));

require('babel-polyfill')
require('babel-register')(babelConfig);
require('./app.js');