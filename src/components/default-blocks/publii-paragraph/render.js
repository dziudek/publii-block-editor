function render (blockData) {
  let id = blockData.config.id ? 'id="' + blockData.config.id + '"' : '';
  let cssClasses = blockData.config.cssClasses ? 'class="' + blockData.config.cssClasses + '"' : '';
  let html = `<p>${blockData.content}</p>`;

  return html;
};

module.exports = render;
