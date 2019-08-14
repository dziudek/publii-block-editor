function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = (blockData.config.advanced.cssClasses || blockData.config.advanced.style) ? ' class="' + blockData.config.cssClasses + ' ' + blockData.config.advanced.style + '"' : '';
  let textAlign = blockData.config.textAlign;
  let textAlignStyle = '';

  if (textAlign !== 'left') {
    textAlignStyle = ' style="text-align: ' + textAlign + ';"';
  }

  let html = `
  <p${id}${cssClasses}${textAlignStyle}>
    ${blockData.content}
  </p>`;

  return html;
};

module.exports = render;
