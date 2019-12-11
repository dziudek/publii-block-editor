function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let languageClass = ' language-' + blockData.config.language;
  let cssClasses = ' class="' + blockData.config.advanced.cssClasses + languageClass + '"';
  let html = `<pre${id}${cssClasses}><code>${blockData.content}</code></pre>`;
  return html;
};

module.exports = render;
