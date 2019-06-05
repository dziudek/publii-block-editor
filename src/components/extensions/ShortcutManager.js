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
    this.shortcuts['/code'] = 'publii-code';
    this.shortcuts['/readmore'] = 'publii-readmore';
    this.shortcuts['/html'] = 'publii-html';
    this.shortcuts['/toc'] = 'publii-toc';
    this.shortcuts['/embed'] = 'publii-embed';
    this.shortcuts['/image'] = 'publii-image';
  }

  initMarkdownDefaultShortcuts () {
    this.shortcuts['---'] = 'publii-separator';
    this.shortcuts['***'] = 'publii-readmore';
    this.shortcuts['#'] = 'publii-header';
    this.shortcuts['*'] = 'publii-list';
    this.shortcuts['>'] = 'publii-quote';
    this.shortcuts['```'] = 'publii-code';
  }

  checkContentForShortcuts (text) {
    if (text !== '' && text.length < 24 && this.shortcuts[text]) {
      return this.shortcuts[text];
    }

    return 'publii-paragraph';
  }

  add (shortcut, componentName) {
    if (!this.shortcuts[shortcut]) {
      this.shortcuts[shortcut] = componentName;
    } else {
      console.warn('The following shortcut is already defined: ' + shortcut + ' for the following block: ' + this.shortcuts[shortcut]);
    }
  }
};
