function render (blockData) {
  let id = blockData.config.id ? 'id="' + blockData.config.id + '"' : '';
  let cssClasses = blockData.config.cssClasses ? 'class="' + blockData.config.cssClasses + '"' : '';
  let html = `
  <blockquote>
    <p>${blockData.content.text}</p>
    <cite>${blockData.content.author}</cite>
  </blockquote>`;

  return html;
};

module.exports = render;
