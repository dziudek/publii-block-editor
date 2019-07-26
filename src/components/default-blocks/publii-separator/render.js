function render (blockData) {
  let id = blockData.config.id ? 'id="' + blockData.config.id + '"' : '';
  let cssClasses = blockData.config.cssClasses ? 'class="' + blockData.config.cssClasses + '"' : '';
  let html = `<hr />`;

  return html;
};

module.exports = render;
