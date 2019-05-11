export default class ShortcutManager {
  constructor () {
    this.shortcuts = {};
    this.initDefaultShortcuts();
    this.initMarkdownDefaultShortcuts();
  }

  initDefaultShortcuts () {
    this.shortcuts['/separator'] = 'publii-separator';
    this.shortcuts['/header'] = 'publii-header';
    this.shortcuts['/list'] = 'publii-list';
    this.shortcuts['/quote'] = 'publii-quote';
  }

  initMarkdownDefaultShortcuts () {
    this.shortcuts['***'] = 'publii-separator';
    this.shortcuts['#'] = 'publii-header';
    this.shortcuts['*'] = 'publii-list';
    this.shortcuts['>'] = 'publii-quote';
  }

  checkContentForShortcuts (text) {
    if (text !== '' && text.length < 24 && this.shortcuts[text]) {
      return this.shortcuts[text];
    }

    return 'paragraph';
  }

  add (shortcut, componentName) {
    if (!this.shortcuts[shortcut]) {
      this.shortcuts[shortcut] = componentName;
    } else {
      console.warn('The following shortcut is already defined: ' + shortcut + ' for the following block: ' + this.shortcuts[shortcut]);
    }
  }
};
