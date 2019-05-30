<script>
import EditorIcon from './../elements/EditorIcon.vue';

export default {
  name: 'InlineMenu',
  components: {
    'icon': EditorIcon
  },
  data () {
    return {
      selectedTextContains: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        mark: false,
        link: false
      },
      textIsHighlighted: true
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
      this.analyzeSelectedText(sel, savedSel);
      this.$rangy.restoreSelection(savedSel);
      this.$rangy.removeMarkers(savedSel);
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs['block'].getBoundingClientRect();
      let inlineMenuLeft = ((oRect.left - wrapperRect.left) + (oRect.width / 2)) + 'px';
      let inlineMenuTop = (oRect.top - wrapperRect.top - 20) + 'px';
      this.$refs['inline-menu'].setPosition(inlineMenuLeft, inlineMenuTop);
    },
    analyzeSelectedText (selection, rangyData) {
      if (!selection || !selection.anchorNode || !selection.focusNode) {
        return;
      }

      let tags = [
        'bold',
        'italic',
        'underline',
        'strikethrough'
      ];

      for (let i = 0; i < tags.length; i++) {
        this.selectedTextContains[tags[i]] = document.queryCommandState(tags[i]);
      }

      let specialTags = {
        'code': 'code',
        'mark': 'mark',
        'a': 'link'
      };

      let specialTagNames = Object.keys(specialTags);
      let selectedTextResults = this.findTagInSelection(specialTagNames, rangyData);

      for (let i = 0; i < specialTagNames.length; i++) {
        this.selectedTextContains[specialTags[specialTagNames[i]]] = selectedTextResults[specialTagNames[i]];
      }
    },
    findTagInSelection (tagNames, rangyData) {
      let startID = rangyData.rangeInfos[0].startMarkerId;
      let endID = rangyData.rangeInfos[0].endMarkerId;
      let sourceCode = this.$refs['block'].innerHTML;
      let partToAnalyze = sourceCode.split(startID)[1];
      partToAnalyze = partToAnalyze.split(endID)[0];
      let results = {};

      for (let i = 0; i < tagNames.length; i++) {
        results[tagNames[i]] = partToAnalyze.indexOf('<' + tagNames[i]) > -1;

        if (results[tagNames[i]] === false) {
          if (this.$refs['block'].querySelector('#' + startID).parentNode.tagName === tagNames[i].toUpperCase()) {
            results[tagNames[i]] = true;
          }
        }
      }

      return results;
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
      }

      this.analyzeSelectedText(sel, savedSel);
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
        this.selectedTextContains[tagToUse] = false;
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
          this.selectedTextContains[tagToUse] = true;
        } else {
          let selection = document.getSelection();
          this.wrapElementIntoRangy(selection.baseNode, startID, endID);
        }
      }
    },
    checkTagPosition (tag, startID, endID) {
      let codeToAnalyze = this.$refs['block'].innerHTML.split(startID)[1];
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
      let textToModify = this.$refs['block'].innerHTML;
      textToModify = textToModify.split('<span id="' + startID + '"></span>');
      textToModify[1] = textToModify[1].split('<span id="' + endID + '"></span>');

      let modifiedText = [
        textToModify[0],
        '<span id="' + startID + '"></span>',
        rawText,
        '<span id="' + endID + '"></span>',
        textToModify[1][1]
      ].join('');

      this.$refs['block'].innerHTML = modifiedText;
    }
  }
}
</script>
