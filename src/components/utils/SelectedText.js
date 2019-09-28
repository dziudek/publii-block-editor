import Vue from 'vue';

export default class SelectedText {
  constructor (selection, inlineMenuContainer, blockType) {
    this.blockType = blockType;
    this.selection = selection;
    this.inlineMenuContainer = inlineMenuContainer;

    this.features = {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      mark: false,
      link: false,
      indent: true,
      outdent: true
    };

    this.tagsToCheck = {
      'bold': 'b',
      'italic': 'i',
      'underline': 'u',
      'strikethrough': 's',
      'code': 'code',
      'mark': 'mark',
      'link': 'a'
    };
  }

  isProperTextSelection () {
    return !this.selection || !this.selection.anchorNode || !this.selection.focusNode;
  }

  analyzeSelectedText () {
    if (this.isProperTextSelection()) {
      return;
    }

    let range = this.selection.getRangeAt(0);
    let tempElement = document.createElement('div');
    tempElement.appendChild(range.cloneContents());
    let featuresToCheck = Object.keys(this.tagsToCheck);
    let htmlToCheck = tempElement.innerHTML;

    for (let i = 0; i < featuresToCheck.length; i++) {
      let tag = this.tagsToCheck[featuresToCheck[i]];

      if (htmlToCheck.indexOf('<' + tag + ' ') > -1 || htmlToCheck.indexOf('</' + tag + '>') > -1) {
        Vue.set(this.features, featuresToCheck[i], true);
      } else {
        Vue.set(this.features, featuresToCheck[i], false);
      }
    }

    tempElement.remove();

    if (this.blockType === 'publii-list') {
      Vue.set(this.features, 'indent', this.checkIfElementCanBeNested());
      Vue.set(this.features, 'outdent', this.checkIfElementCanBeFlattened());
    }
  }

  removeStyle (tag) {
    // let range = this.selection.getRangeAt(0);
  }

  checkIfElementCanBeNested () {
    let baseItem = this.selection.baseNode;
    let parentList;
    let listItem;

    if (this.selection.baseNode.nodeType === 3) {
      baseItem = this.selection.baseNode.parentNode;
    }

    parentList = baseItem.closest('ul,ol');

    if (this.selection.baseNode.tagName === 'LI') {
      listItem = baseItem;
    } else {
      listItem = baseItem.closest('li');
    }

    if (parentList.children.length <= 1) {
      return false;
    }

    if (parentList.children[0] === listItem) {
      return false;
    }

    return true;
  }

  checkIfElementCanBeFlattened () {
    let baseItem = this.selection.baseNode;
    let parentList;

    if (this.selection.baseNode.nodeType === 3) {
      baseItem = this.selection.baseNode.parentNode;
    }

    parentList = baseItem.closest('ul,ol');

    if (parentList !== null && parentList !== parentList.closest('.publii-block-list')) {
      return true;
    }

    return false;
  }
}
