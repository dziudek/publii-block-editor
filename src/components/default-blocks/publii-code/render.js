function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let html = `<pre${id}${cssClasses}><code>${blockData.content}</code></pre>`;
  return html;
};

module.exports = render;
