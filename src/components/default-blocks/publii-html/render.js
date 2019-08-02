const contentFilter = require('./content-filter.js');

function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let html = contentFilter(blockData.content);
  return `<div${id}${cssClasses}>${html}</div>`;
};

module.exports = render;
