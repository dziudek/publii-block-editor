function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = [blockData.config.advanced.cssClasses, 'separator-' + blockData.config.type];
  cssClasses = cssClasses.filter(item => item && item.trim() !== '' && item !== 'separator-dots');

  if (cssClasses.length) {
    cssClasses = ' class="' + cssClasses.join(' ') + '"';
  } else {
    cssClasses = '';
  }

  let html = `<hr${id}${cssClasses} />`;

  return html;
};

module.exports = render;
