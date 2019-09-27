import Vue from 'vue';

export default class SelectedText {
  constructor (selection, rangyData, inlineMenuContainer) {
    this.selection = selection;
    this.rangyData = rangyData;
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

    this.tags = [
      'bold',
      'italic',
      'underline',
      'strikethrough'
    ];

    this.specialTags = {
      'code': 'code',
      'mark': 'mark',
      'a': 'link'
    };
  }

  analyzeSelectedText () {
    if (
      !this.selection ||
      !this.selection.anchorNode ||
      !this.selection.focusNode
    ) {
      return;
    }

    for (let i = 0; i < this.tags.length; i++) {
      this.features[this.tags[i]] = document.queryCommandState(this.tags[i]);
    }

    let specialTagNames = Object.keys(this.specialTags);
    let selectedTextResults = this.findTagInSelection(specialTagNames);

    for (let i = 0; i < specialTagNames.length; i++) {
      Vue.set(this.features, this.specialTags[specialTagNames[i]], selectedTextResults[specialTagNames[i]]);
    }

    Vue.set(this.features, 'indent', this.checkIfElementCanBeNested());
    Vue.set(this.features, 'outdent', this.checkIfElementCanBeFlattened());
  }

  findTagInSelection (tagNames) {
    if (!this.rangyData || this.rangyData.rangeInfos[0].collapsed) {
      return false;
    }

    let startID = this.rangyData.rangeInfos[0].startMarkerId;
    let endID = this.rangyData.rangeInfos[0].endMarkerId;
    let sourceCode = this.inlineMenuContainer.innerHTML;
    let partToAnalyze = sourceCode.split(startID)[1];
    partToAnalyze = partToAnalyze.split(endID)[0];
    let results = {};

    for (let i = 0; i < tagNames.length; i++) {
      results[tagNames[i]] = partToAnalyze.indexOf('<' + tagNames[i]) > -1;

      if (results[tagNames[i]] === false) {
        if (this.inlineMenuContainer.querySelector('#' + startID).parentNode.tagName === tagNames[i].toUpperCase()) {
          results[tagNames[i]] = true;
        }
      }
    }

    return results;
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

    console.log(parentList, listItem);

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
