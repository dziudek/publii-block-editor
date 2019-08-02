function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let headingLevel = blockData.config.headingLevel;
  let html = `
  <h${headingLevel}${id}${cssClasses}>
    ${blockData.content}
  </h${headingLevel}>`;

  return html;
};

module.exports = render;
