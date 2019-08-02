function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let html = `
  <blockquote${id}${cssClasses}>
    <p>${blockData.content.text}</p>
    <cite>${blockData.content.author}</cite>
  </blockquote>`;

  return html;
};

module.exports = render;
