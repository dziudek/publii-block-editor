const path = require('path');

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining'
  ],
  exclude: [
    path.resolve('./src/components/default-blocks/**/*.js')
  ]
}
