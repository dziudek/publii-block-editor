<script>
export default {
  name: 'InlineMenu',
  methods: {
    showInlineMenu () {
      let sel = window.getSelection();
      let savedSel = this.$rangy.saveSelection();
      this.analyzeSelectedText(sel, savedSel);
      this.$rangy.restoreSelection(savedSel);
      this.$rangy.removeMarkers(savedSel);
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs['block'].getBoundingClientRect();
      this.$refs['inline-menu'].style.left = ((oRect.left - wrapperRect.left) + (oRect.width / 2)) + 'px';
      this.$refs['inline-menu'].style.top = (oRect.top - wrapperRect.top - 20) + 'px';
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
      let sel = window.getSelection();
      let savedSel = this.$rangy.saveSelection();
      let startID = savedSel.rangeInfos[0].startMarkerId;
      let endID = savedSel.rangeInfos[0].endMarkerId;

      switch (operationType) {
        case 'strong': document.execCommand('bold', false, null); break;
        case 'em': document.execCommand('italic', false, null); break;
        case 's': document.execCommand('strikeThrough', false, null); break;
        case 'u': document.execCommand('underline', false, null); break;
        case 'code': {
          if (document.getElementById(startID).nextSibling && document.getElementById(startID).nextSibling.tagName === 'CODE') {
            document.execCommand('insertHTML', false, '<span id="' + startID + '"></span>' + document.getSelection() + '<span id="' + endID + '"></span>');
            this.selectedTextContains['code'] = false;
          } else {
            document.execCommand('insertHTML', false, '<span id="' + startID + '"></span><code>' + document.getSelection() + '</code><span id="' + endID + '"></span>');
            this.selectedTextContains['code'] = true;
          }

          break;
        }
        case 'mark': {
          if (document.getElementById(startID).nextSibling && document.getElementById(startID).nextSibling.tagName === 'MARK') {
            document.execCommand('insertHTML', false, '<span id="' + startID + '"></span>' + document.getSelection() + '<span id="' + endID + '"></span>');
            this.selectedTextContains['mark'] = false;
          } else {
            document.execCommand('insertHTML', false, '<span id="' + startID + '"></span><mark>' + document.getSelection() + '</mark><span id="' + endID + '"></span>');
            this.selectedTextContains['mark'] = true;
          }

          break;
        }
      }

      this.analyzeSelectedText(sel, savedSel);
      this.$rangy.restoreSelection(savedSel);
      this.$rangy.removeMarkers(savedSel);
    }
  }
}
</script>

<style lang="scss">
.wrapper-ui-inline-menu {
  background: #fff;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: flex;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0%;
  transform: translateX(-50%);
  z-index: 1;

  &-button {
    align-items: center;
    border: none;
    cursor: pointer;
    display: flex;
    height: 32px;
    justify-content: center;
    outline: none;
    width: 32px;

    &.is-active {
      background: #eee;
    }
  }
}
</style>
