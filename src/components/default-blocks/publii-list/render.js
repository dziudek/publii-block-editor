function render (blockData) {
  let id = blockData.config.id ? 'id="' + blockData.config.id + '"' : '';
  let cssClasses = blockData.config.cssClasses ? 'class="' + blockData.config.cssClasses + '"' : '';
  let listType = blockData.config.listType;
  let html = `
  <${listType}>
    ${blockData.content}
  </${listType}>`;

  return html;
};

module.exports = render;
