const availableConversions = [
  {
    'icon': 'toc',
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
  }
];

module.exports = availableConversions;