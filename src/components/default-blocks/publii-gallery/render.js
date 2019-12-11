function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.advanced.cssClasses + '"' : '';
  let caption = `<figcaption>${blockData.content.caption}</figcaption>`;
  let html = ``;

  html = `
  <figure${id}${cssClasses} data-align="${blockData.config.imageAlign}">
    <img
      src="${blockData.content.image}"
      height="${blockData.content.imageHeight}"
      width="${blockData.content.imageWidth}"
      alt="${blockData.content.alt}" />
    ${caption}
  </figure>`;

  return html;
};

module.exports = render;
