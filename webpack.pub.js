const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base.js');
const envConfig = require("./src/common/env_config.js");
module.exports = env => {
  const curEnv = env || "local"
  const assetsUrl = envConfig.getAssetsUrl(curEnv, "/demo/")
  return Merge(baseConfig, {
    entry: {
      app: path.resolve(__dirname, 'src/index.js')
    },
    output: {
      filename: "[name].[chunkhash:8].js",
      chunkFilename: '[name].[chunkhash:8].chunk.js',
      path: path.resolve(__dirname, 'dist/demo'),
      publicPath: assetsUrl
    },
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  name: "commons",
                  minChunks: 2
              }
          }
      },
      minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
              beautify: true,  
                output: {
                    comments: false
                },
                compress: {
                  drop_console: (curEnv === 'staging' || curEnv === 'prod'),
                  collapse_vars: true,                                                      // 内嵌定义了但是只用到一次的变量
                  reduce_vars: true,        
                }
            }
        }),
      ]
    },
    plugins: [
      new LodashModuleReplacementPlugin,
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['dist']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'BUILD_ENV': JSON.stringify(curEnv)
      }),
      new ExtractTextPlugin({
        filename: "app.[contenthash:8].css",
        allChunks: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        htmlWebpackPlugin: {
          'files': {
            'css': ['app.css'],
            'js': ['index.js', 'common.js']
          }
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          minifyJS: true
        },
        chunksSortMode: function (chunk1, chunk2) {
          var orders = ['common', 'vendor', 'debug', 'app'];
          var order1 = orders.indexOf(chunk1.names[0]);
          var order2 = orders.indexOf(chunk2.names[0]);
          if (order1 > order2) {
            return 1;
          } else if (order1 < order2) {
            return -1;
          } else {
            return 0;
          }
        },
        webfunny: true,
        baiduAs: true
      }),
      new ManifestPlugin({
        publicPath: assetsUrl
      }),
      new CopyWebpackPlugin([
        { from: __dirname + '/src/pwa/',
          to: __dirname + '/dist/pwa/'
        }
      ])
    ]
  });
}
