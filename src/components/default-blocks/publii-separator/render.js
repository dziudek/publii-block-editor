function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['separator', blockData.config.advanced.cssClasses, 'separator--' + blockData.config.type].filter(item => item && item.trim() !== '');

  if (cssClasses.length) {
    cssClasses = ' class="' + cssClasses.join(' ') + '"';
  } else {
    cssClasses = '';
  }

  let html = `<hr${id}${cssClasses} />`;

  return html;
};

module.exports = render;
