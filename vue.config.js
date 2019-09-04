module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
    // Not naming bundle 'app'
    config.entryPoints.delete('app');
  },
  // Overriding webpack config
  configureWebpack: {
    // Naming bundle 'bundleName'
    entry: {
      'publii-block-editor': './src/main.js'
    }
  },
  publicPath: './'
};
