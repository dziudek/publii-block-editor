const availableConversions = [
  {
    'icon': 'paragraph',
    'name': 'Paragraph',
    'type': 'publii-paragraph',
    'convert': function (config, content, editorInstance) {
      // eslint-disable-next-line
      let newContent = editorInstance.extensions.conversionHelpers.stripTags(content.replace(/<\/li><li>/gmi, "\n")).replace(/\n/gmi, '<br>');
      let newConfig = {
        textAlign: 'left',
        advanced: {
          style: '',
          cssClasses: config.advanced.cssClasses,
          id: config.advanced.id
        }
      };

      return {
        content: newContent,
        config: newConfig
      };
    }
  },
  {
    'icon': 'html',
    'name': 'HTML',
    'type': 'publii-html',
    'convert': function (config, content, editorInstance, rawBlock) {
      let newContent = rawBlock.outerHTML
        // eslint-disable-next-line
        .replace(/<ul.*?>/gmi, '<ul>')
        // eslint-disable-next-line
        .replace(/<ol.*?>/gmi, '<ol>')
        // eslint-disable-next-line
        .replace(/<\/li><li>/gmi, "</li>\n<li>")
        // eslint-disable-next-line
        .replace(/ul><li>/gmi, "ul>\n<li>")
        // eslint-disable-next-line
        .replace(/ol><li>/gmi, "ol>\n<li>")
        // eslint-disable-next-line
        .replace(/<\/li><\/ul>/gmi, "</li>\n</ul>");
      let newConfig = {
        advanced: {
          cssClasses: config.advanced.cssClasses,
          id: config.advanced.id
        }
      };

      return {
        content: newContent,
        config: newConfig
      };
    }
  }
];

module.exports = availableConversions;
