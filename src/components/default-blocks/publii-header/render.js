function render (blockData) {
  let id = blockData.config.id ? 'id="' + blockData.config.id + '"' : '';
  let cssClasses = blockData.config.cssClasses ? 'class="' + blockData.config.cssClasses + '"' : '';
  let headingLevel = blockData.config.headingLevel;
  let html = `
  <h${headingLevel}>
    ${blockData.content}
  </h${headingLevel}>`;

  return html;
};

module.exports = render;
