const path = require('path');

module.exports = {
  presets: [
    '@vue/app'
  ],
  exclude: [
    path.resolve('./src/components/default-blocks/**/*.js')
  ]
}
