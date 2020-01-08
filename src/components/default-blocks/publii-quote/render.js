function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ['blockquote', blockData.config.advanced.cssClasses].filter(item => item && item.trim() !== '');

  if (cssClasses.length) {
    cssClasses = ' class="' + cssClasses.join(' ') + '"';
  } else {
    cssClasses = '';
  }

  let html = '';

  if (blockData.content.author.trim() !== '') {
    html = `
    <figure${id}${cssClasses}>
      <blockquote>${blockData.content.text}</blockquote>
      <figcaption>${blockData.content.author}</figcaption>
    </figure>`;
  } else {
    html = `
    <blockquote${id}${cssClasses}>
      ${blockData.content.text}
    </blockquote>`;
  }

  return html;
};

module.exports = render;
