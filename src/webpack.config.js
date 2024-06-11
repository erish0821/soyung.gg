// webpack.config.js
const webpack = require('webpack');

module.exports = {
  // other configurations...
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
