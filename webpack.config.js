/**
 * Created by Diablo on 16/7/16.
 */
'use strict';
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'});
var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: {
		path.join(__dirname + "/src/index.js")
    },
    	
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        publicPath: '/static/'
    },
    
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,

            },
            {
            	test: /\.css/,
            	loader:"style-loader!css-loader"
            },
            {
            	test: /.(svg)$/,
            	loader:"url-loader"
            }
        ]
    },
    resolve: {
        modules: [
        path.join(__dirname, "src"),
        "node_modules"
      ]
    }
};