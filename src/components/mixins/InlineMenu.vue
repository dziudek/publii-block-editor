<script>
import EditorIcon from './../elements/EditorIcon.vue';
import LinkHelpers from './../mixins/LinkHelpers.vue';
import LinkConfig from './../mixins/LinkConfig.vue';
import SelectedText from './../utils/SelectedText.js';

export default {
  name: 'InlineMenu',
  mixins: [
    LinkConfig,
    LinkHelpers
  ],
  components: {
    'icon': EditorIcon
  },
  data () {
    return {
      inlineMenuContainer: 'block',
      selectedText: {
        features: {}
      }
    };
  },
  methods: {
    handleMouseUp (e) {
      setTimeout(() => {
        let sel = document.getSelection();

        if (sel.isCollapsed) {
          this.textIsHighlighted = false;
        } else {
          this.textIsHighlighted = !sel.isCollapsed || (sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset);
        }

        if (this.textIsHighlighted) {
          setTimeout(() => {
            this.showInlineMenu();
          }, 0);
        }
      }, 0);
    },
    showInlineMenu () {
      let sel = document.getSelection();
      let savedSel = this.$rangy.saveSelection();
      this.selectedText = new SelectedText(sel, savedSel, this.$refs[this.inlineMenuContainer]);
      this.selectedText.analyzeSelectedText();
      this.$rangy.restoreSelection(savedSel);
      this.$rangy.removeMarkers(savedSel);
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs[this.inlineMenuContainer].getBoundingClientRect();
      let inlineMenuOffsets = this.getInlineMenuOffsets();
      let inlineMenuLeft = (((oRect.left - wrapperRect.left) + (oRect.width / 2)) + inlineMenuOffsets.x) + 'px';
      let inlineMenuTop = (oRect.top - wrapperRect.top + inlineMenuOffsets.y) + 'px';
      this.$refs['inline-menu'].setPosition(inlineMenuLeft, inlineMenuTop);
      this.$highlighter.removeAllHighlights();
    },
    getInlineMenuOffsets () {
      let x = 30;
      let y = -20;

      if (this.$parent.blockType === 'publii-quote') {
        y = -10;
      }

      if (this.$parent.blockType === 'publii-list') {
        x = 65;
      }

      return { x, y };
    },
    doInlineOperation (operationType) {
      let sel = document.getSelection();
      let savedSel = this.$rangy.saveSelection();

      switch (operationType) {
        case 'strong': document.execCommand('bold', false, null); break;
        case 'em': document.execCommand('italic', false, null); break;
        case 's': document.execCommand('strikeThrough', false, null); break;
        case 'u': document.execCommand('underline', false, null); break;
        case 'code': this.execCommand('code', savedSel); break;
        case 'mark': this.execCommand('mark', savedSel); break;
        case 'link': this.addLink(); break;
        case 'unlink': this.removeLink(savedSel); break;
        case 'indent': this.indentList(); break;
        case 'outdent': this.outdentList(); break;
      }

      this.selectedText = new SelectedText(sel, savedSel, this.$refs[this.inlineMenuContainer]);
      this.selectedText.analyzeSelectedText();
      this.$rangy.restoreSelection(savedSel);
      this.$rangy.removeMarkers(savedSel);
    },
    execCommand (tagToUse, rangyData) {
      let startID = rangyData.rangeInfos[0].startMarkerId;
      let endID = rangyData.rangeInfos[0].endMarkerId;
      let nextNode = document.getElementById(startID).nextSibling;
      let tagToUseUpperCase = tagToUse.toUpperCase();

      if (nextNode && nextNode.tagName === tagToUseUpperCase) {
        let html = [
          '<span id="' + startID + '"></span>',
          document.getSelection().toString().replace(/&nbsp;/gmi, ''),
          '<span id="' + endID + '"></span>'
        ];

        document.execCommand('insertHTML', false, html.join(''));
        this.selectedTextFeatures[tagToUse] = false;
      } else {
        let wrapperTag = document.getElementById(startID).parentNode.tagName;
        let tagPosition = this.checkTagPosition(tagToUse, startID, endID);

        if ((tagPosition === -1 || tagPosition > 0) && wrapperTag !== tagToUseUpperCase) {
          let html = [
            '<span id="' + startID + '"></span>',
            '<' + tagToUse + '>',
            document.getSelection().toString().replace(/&nbsp;/gmi, ''),
            '</' + tagToUse + '>',
            '<span id="' + endID + '"></span>'
          ];

          document.execCommand('insertHTML', false, html.join(''));
          this.selectedTextFeatures[tagToUse] = true;
        } else {
          let selection = document.getSelection();
          this.wrapElementIntoRangy(selection.baseNode, startID, endID);
        }
      }
    },
    indentList () {
      document.execCommand('indent', false, null);
    },
    outdentList () {
      document.execCommand('outdent', false, null);
    },
    addLink () {
      let selection = document.querySelector('.is-highlighted');

      if (!selection) {
        return;
      }

      if (this.linkIsInvalid(this.linkUI.url)) {
        this.linkUI.url = 'https://' + this.linkUI.url;
      }

      selection.outerHTML = '<a href="' + this.linkUI.url + '">' + selection.innerHTML + '</a>';
      this.selectedTextFeatures['link'] = true;
    },
    removeLink (rangyData) {
      let startID = rangyData.rangeInfos[0].startMarkerId;
      let endID = rangyData.rangeInfos[0].endMarkerId;
      let html = [
        '<span id="' + startID + '"></span>',
        document.getSelection().toString().replace(/&nbsp;/gmi, ''),
        '<span id="' + endID + '"></span>'
      ];

      document.execCommand('insertHTML', false, html.join(''));
      this.selectedTextFeatures['link'] = false;
    },
    checkTagPosition (tag, startID, endID) {
      let codeToAnalyze = this.$refs[this.inlineMenuContainer].innerHTML.split(startID)[1];
      codeToAnalyze = codeToAnalyze.split(endID)[0];

      if (codeToAnalyze.indexOf('<' + tag) > -1) {
        return codeToAnalyze.indexOf('<' + tag);
      }

      return -1;
    },
    wrapElementIntoRangy (element, startID, endID) {
      if (element.tagName === 'P') {
        return;
      }

      let spanStart = document.createElement('span');
      spanStart.setAttribute('id', startID);
      let spanEnd = document.createElement('span');
      spanEnd.setAttribute('id', endID);

      if (document.getElementById(startID)) {
        element.removeChild(document.getElementById(startID));
      }

      if (document.getElementById(endID)) {
        element.removeChild(document.getElementById(endID));
      }

      element.parentNode.insertBefore(spanStart, element);
      element.parentNode.insertBefore(spanEnd, element.nextSibling);

      let rawText = element.innerText.replace(/&nbsp;/gmi, '');
      let textToModify = this.$refs[this.inlineMenuContainer].innerHTML;
      textToModify = textToModify.split('<span id="' + startID + '"></span>');
      textToModify[1] = textToModify[1].split('<span id="' + endID + '"></span>');

      let modifiedText = [
        textToModify[0],
        '<span id="' + startID + '"></span>',
        rawText,
        '<span id="' + endID + '"></span>',
        textToModify[1][1]
      ].join('');

      this.$refs[this.inlineMenuContainer].innerHTML = modifiedText;
    }
  }
}
</script>
