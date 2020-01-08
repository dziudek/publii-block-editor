function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['toc', blockData.config.advanced.cssClasses].filter(item => item && item.trim() !== '');
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let tocHeading = '';

  if (blockData.content.title.trim() !== '') {
    tocHeading = `<h2>${blockData.content.title}</h2>`;
  }

  let html = `
  <div${id}${cssClasses}>
    ${tocHeading}
    <ul>
      ${blockData.content.toc}
    </ul>
  </div>
  `;

  return html;
};

module.exports = render;
