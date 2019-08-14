function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let caption = `<figcaption>${blockData.content.caption}</figcaption>`;
  let html = ``;

  if (blockData.config.link.url !== '') {
    let relNoFollow = '';
    let targetBlank = '';

    if (blockData.config.link.noFollow) {
      relNoFollow = ' rel="nofollow"';
    }

    if (blockData.config.link.targetBlank) {
      targetBlank = ' target="_blank"'
    }

    html = `
    <figure${id}${cssClasses} data-align="${blockData.config.imageAlign}">
      <a href="${blockData.config.link.url}"${relNoFollow}${targetBlank}>
        <img
          src="${blockData.content.image}"
          height="${blockData.content.imageHeight}"
          width="${blockData.content.imageWidth}"
          alt="${blockData.content.alt}" />
      </a>
      ${caption}
    </figure>`;
  } else {
    html = `
    <figure${id}${cssClasses} data-align="${blockData.config.imageAlign}">
      <img
        src="${blockData.content.image}"
        height="${blockData.content.imageHeight}"
        width="${blockData.content.imageWidth}"
        alt="${blockData.content.alt}" />
      ${caption}
    </figure>`;
  }

  return html;
};

module.exports = render;
