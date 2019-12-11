function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = [blockData.config.advanced.cssClasses, blockData.config.advanced.style, 'align-' + blockData.config.textAlign];
  cssClasses = cssClasses.filter(item => item && item.trim() !== '');
  cssClasses = ' class="' + cssClasses.join(' ') + '"';

  let html = `
  <p${id}${cssClasses}>
    ${blockData.content}
  </p>`;

  return html;
};

module.exports = render;
