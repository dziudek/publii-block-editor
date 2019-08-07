function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let html = `
  <div${id}${cssClasses}>
    <h2>${blockData.content.title}</h2>
    <div>
      ${blockData.content.toc}
    </div>
  </div>
  `;

  return html;
};

module.exports = render;
