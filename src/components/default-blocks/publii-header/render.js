function render (blockData) {
  let id = blockData.config.advanced.id ? ' id="' + blockData.config.advanced.id + '"' : '';
  let cssClasses = blockData.config.advanced.cssClasses ? ' class="' + blockData.config.cssClasses + '"' : '';
  let headingLevel = blockData.config.headingLevel;
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
    <h${headingLevel}${id}${cssClasses}>
      <a href="${blockData.config.link.url}"${relNoFollow}${targetBlank}>
      ${blockData.content}
      </a>
    </h${headingLevel}>`;
  } else {
    html = `
    <h${headingLevel}${id}${cssClasses}>
      ${blockData.content}
    </h${headingLevel}>`;
  }

  return html;
};

module.exports = render;
