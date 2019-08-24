const availableConversions = [
  {
    'icon': 'paragraph',
    'name': 'Paragraph',
    'type': 'publii-paragraph',
    'convert': function (config, content, editorInstance) {
      let newConfig = {
        textAlign: 'left',
        advanced: {
          style: '',
          cssClasses: config.advanced.cssClasses,
          id: config.advanced.id
        }
      };

      return {
        content: content.text,
        config: newConfig
      };
    }
  }
];

module.exports = availableConversions;
