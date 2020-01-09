function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['post__toc', blockData.config.advanced.cssClasses].filter(item => item && item.trim() !== '');
  cssClasses = cssClasses.length ? ' class="' + cssClasses.join(' ') + '"' : '';
  let tocHeading = '';

  if (blockData.content.title.trim() !== '') {
    tocHeading = `<h3>${blockData.content.title}</h3>`;
  }

  let html = `
  <div${id}${cssClasses}>
    ${tocHeading}
    <ol>
      ${blockData.content.toc}
    </ol>
  </div>
  `;

  return html;
};

module.exports = render;
