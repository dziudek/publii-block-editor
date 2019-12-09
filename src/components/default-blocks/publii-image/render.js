function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = ' class="post__image ' + blockData.config.advanced.cssClasses + '"';
  let caption = `<figcaption>${blockData.content.caption}</figcaption>`;
  let html = ``;

  if (blockData.config.link.url !== '') {
    let targetBlank = '';
    let relAttr = [];

    if (blockData.config.link.noFollow) {
      relAttr.push('nofollow noopener');
    }

    if (blockData.config.link.sponsored) {
      relAttr.push('sponsored');
    }

    if (blockData.config.link.ugc) {
      relAttr.push('ugc');
    }

    if (relAttr.length) {
      relAttr = ' rel="' + relAttr.join(' ') + '"';
    }

    if (blockData.config.link.targetBlank) {
      targetBlank = ' target="_blank"'
    }

    html = `
    <figure${id}${cssClasses} data-align="${blockData.config.imageAlign}">
      <a href="${blockData.config.link.url}"${relAttr}${targetBlank}>
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
