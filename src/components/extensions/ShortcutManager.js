export default class ShortcutManager {
  constructor () {
    this.shortcuts = {};
  }

  add (shortcut, componentName) {
    if (!this.shortcuts[shortcut]) {
      this.shortcuts[shortcut] = componentName;
    } else {
      console.warn('The following shortcut is already defined: ' + shortcut + ' for the following block: ' + this.shortcuts[shortcut]);
    }
  }
};
