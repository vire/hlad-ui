var webpack = require('webpack');
var path = require('path');
var dotenv = require('dotenv');

dotenv.load();

const webpackConfig = {
  devtool: 'source-map',
  entry: {
    tsx: './src/main.tsx',
    html: './src/index.html'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }, {
        test: /\.css$/,
        exclude: /styles/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ]
      }, {
        test: /\.css$/,
        include: /styles/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap',
          'postcss-loader'
        ]
      }, {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader',
          'ts-loader',
        ],
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__FIREBASE_ID': JSON.stringify(process.env.FIREBASE_ID)
    }),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js']
  },
  devServer: {
    stats: { colors: true },
  },
};

module.exports = webpackConfig;
