const webpack = require('webpack')
const path = require('path')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')

var config = {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel?cacheDirectory'
      },
      {
        test: /\.styl$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[path]!stylus?sourceMap'
      }
    ]
  },
  entry: {
    main: './main/index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.styl'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    alias: {
      'main': path.join(__dirname, 'main')
    }
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new NodeTargetPlugin()
  ],
  stylus: {
    use: [require('nib')()],
    import: [
      '~nib/lib/nib/index.styl'
    ]
  },
  externals: [
    'serialport',
    {
      react: 'var React',
      'react-dom': 'var ReactDOM',
      'react-redux': 'var ReactRedux',
      'redux': 'var Redux'
    }
  ],
  output: {
    path: path.join(__dirname, 'compiled'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    libraryTarget: 'commonjs2',
    publicPath: 'http://localhost:8080/assets/'
  },
  debug: true,
  devtool: 'cheap-module-eval-source-map'
}

module.exports = config

