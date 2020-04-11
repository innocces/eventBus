/*
 * @Date: 2020-04-11 20:10:36
 * @Author: innocces
 * @LastEditors: innocces
 * @LastEditTime: 2020-04-11 23:15:00
 * @FilePath: /eventBus/webpack.config.js
 * @Description: webpack config
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Webpack = require('webpack')

module.exports = {
  entry: {
    react: './src/react.entry.js',
    vue: './src/vue.entry.js',
    // vueCore: 'vue',
    // reactCore: [ 'react', 'react-dom' ]
  },
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]!(vue|react|react-dom)/,
          name: 'vendors',
          chunks: 'all'
        },
        'vue': {
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          chunks: 'all'
        },
        'react': {
          test: /[\\/]node_modules[\\/]react[\\/]/,
          chunks: 'all'
        },
        'react-dom': {
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { 
            loader: 'css-loader',
            options: {
              sourceMap: true
            } 
          },
          { 
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            } 
          },
          { 
            loader: 'less-loader',
            options: {
              sourceMap: true
            } 
          },
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // speed up
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'eventBus',
      template: './index.html'
    }),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[id].[hash].css',
      allChunk: true
    })
  ]
}
