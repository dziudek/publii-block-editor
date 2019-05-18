<script>
export default {
  name: 'InlineMenu',
  methods: {
    showInlineMenu () {
      let sel = window.getSelection();
      this.analyzeSelectedText(sel);
      let oRange = sel.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      let wrapperRect = this.$refs['block'].getBoundingClientRect();
      this.$refs['inline-menu'].style.left = ((oRect.left - wrapperRect.left) + (oRect.width / 2)) + 'px';
      this.$refs['inline-menu'].style.top = (oRect.top - wrapperRect.top - 20) + 'px';
    },
    refreshSelectedTextState () {
      let sel = window.getSelection();
      this.analyzeSelectedText(sel);
    },
    analyzeSelectedText (selection) {
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
        'CODE': 'code',
        'MARK': 'mark',
        'A': 'link'
      };

      let specialTagNames = Object.keys(specialTags);

      for (let i = 0; i < specialTagNames.length; i++) {
        this.selectedTextContains[specialTags[specialTagNames[i]]] = !!this.findParentTag(specialTagNames[i]);
      }
    },
    findParentTag (tagName) {
      let selection = window.getSelection();
      let searchDepth = 10;
      let parentTag = null;

      const boundNodes = [
        selection.anchorNode,
        selection.focusNode
      ];

      boundNodes.forEach((parent) => {
        let iterator = searchDepth;

        while (iterator > 0 && parent.parentNode) {
          if (parent.tagName === tagName) {
            parentTag = parent;

            if (parentTag) {
              break;
            }
          }

          parent = parent.parentNode;
          iterator--;
        }
      });

      return parentTag;
    },
    doInlineOperation (operationType) {
      switch (operationType) {
        case 'strong': document.execCommand('bold', false, null); break;
        case 'em': document.execCommand('italic', false, null); break;
        case 's': document.execCommand('strikeThrough', false, null); break;
        case 'u': document.execCommand('underline', false, null); break;
        case 'code': document.execCommand('insertHTML', false, '<code>' + document.getSelection() + '</code>'); break;
        case 'mark': document.execCommand('insertHTML', false, '<mark>' + document.getSelection() + '</mark>'); break;
      }

      this.refreshSelectedTextState();
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
  flex-wrap: wrap;
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
