function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.advanced.cssClasses + '"' : '';
  let tocHeading = '';

  if (blockData.content.title.trim() !== '') {
    tocHeading = `<h2>${blockData.content.title}</h2>`;
  }

  let html = `
  <div${id}${cssClasses}>
    ${tocHeading}
    <div>
      ${blockData.content.toc}
    </div>
  </div>
  `;

  return html;
};

module.exports = render;
