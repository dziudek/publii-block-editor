<script>
export default {
  name: 'Block',
  props: [
    'id',
    'inputContent',
    'inputConfig',
    'editor'
  ],
  data () {
    return {
      caretIsAtStart: false,
      caretIsAtEnd: false,
      textIsHighlighted: false
    };
  },
  mounted () {
    this.$on('block-save', this.save);
    this.$bus.$on('block-editor-trigger-block-save', this.saveIsNeeded);
  },
  methods: {
    focus (cursorPosition = 'end') {
      this.$refs['block'].focus();

      if (cursorPosition === 'none') {
        return;
      }

      if (cursorPosition === 'end') {
        this.setCursorAtEndOfElement();
      }

      if (typeof cursorPosition === 'number') {
        this.setCursorAtPosition(cursorPosition);
      }

      setTimeout(() => {
        if (this.$refs['code']) {
          this.$refs['code'].focus();
        }
      }, 100);
    },
    setCursorAtPosition (position) {
      let el = this.$refs['block'];
      let range = document.createRange();
      let sel = document.getSelection();
      range.setStart(el.firstChild, position);
      range.setEnd(el.firstChild, position);
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getCaretPosition (node) {
      let range = window.getSelection().getRangeAt(0);
      let preCaretRange = range.cloneRange();
      let caretPosition;
      let tmp = document.createElement('div');

      preCaretRange.selectNodeContents(node);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      tmp.appendChild(preCaretRange.cloneContents());
      caretPosition = tmp.innerHTML.length;

      return caretPosition;
    },
    getHtmlCaretPosition (node) {
      let textPosition = this.getCaretPosition(node);
      let htmlContent = node.innerHTML;
      let textIndex = 0;
      let htmlIndex = 0;
      let insideHtml = false;
      let htmlBeginChars = ['&', '<'];
      let htmlEndChars = [';', '>'];

      if (textPosition === 0) {
        return 0;
      }

      while (textIndex < textPosition) {
        htmlIndex++;

        while (htmlBeginChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
          insideHtml = true;

          while (insideHtml) {
            if (htmlEndChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
              if (htmlContent.charAt(htmlIndex) === ';') {
                htmlIndex--;
              }

              insideHtml = false;
            }

            htmlIndex++;
          }
        }

        textIndex++;
      }

      return htmlIndex;
    },
    getCursorPosition (id) {
      return this.getHtmlCaretPosition(this.$refs[id]);
    },
    setCursorAtEndOfElement (id = 'block', contenteditable = true) {
      if (contenteditable) {
        let range = document.createRange();
        range.selectNodeContents(this.$refs[id]);
        range.collapse(false);

        let sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        let val = this.$refs[id].value;

        setTimeout(() => {
          this.$refs[id].focus();
          this.$refs[id].setSelectionRange(val.length, val.length);
        }, 0);
      }
    },
    handleCaret (e) {
      if (e.code === 'ArrowUp') {
        console.log('POS UP:', this.getCursorPosition('block'))
      }

      if (e.code === 'ArrowDown') {
        console.log('POS DOWN:', this.getCursorPosition('block'))
      }

      if (e.code === 'ArrowUp' && this.getCursorPosition('block') <= 2) {
        if (!this.caretIsAtStart) {
          this.caretIsAtStart = true;
          return;
        }

        let previousBlockID = this.findPreviousBlockID();

        if (previousBlockID) {
          this.editor.$refs['block-wrapper-' + previousBlockID][0].blockClick();
          this.editor.$refs['block-' + previousBlockID][0].focus();
        }
      }

      if (e.code === 'ArrowDown' && this.getCursorPosition('block') >= this.$refs['block'].innerHTML.length - 2) {
        if (!this.caretIsAtEnd) {
          this.caretIsAtEnd = true;
          return;
        }

        let nextBlockID = this.findNextBlockID();

        if (nextBlockID) {
          this.editor.$refs['block-wrapper-' + nextBlockID][0].blockClick();
          this.editor.$refs['block-' + nextBlockID][0].focus('none');
        }
      }

      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        this.caretIsAtStart = false;
        this.caretIsAtEnd = false;
      }
    },
    getFocusFromTab (e) {
      if (e.code === 'Tab') {
        this.focus();
      }
    },
    pastePlainText (e) {
      e.preventDefault();
      let text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
    },
    saveIsNeeded (id) {
      if (this.id === id) {
        this.save();
      }
    },
    findNextBlockID () {
      let currentBlockIndex = this.editor.content.findIndex(el => el.id === this.id);
      currentBlockIndex++;

      if (currentBlockIndex < this.editor.content.length) {
        return this.editor.content[currentBlockIndex].id;
      }

      return false;
    },
    findPreviousBlockID () {
      let currentBlockIndex = this.editor.content.findIndex(el => el.id === this.id);

      if (!currentBlockIndex) {
        return false;
      }

      currentBlockIndex--;

      return this.editor.content[currentBlockIndex].id;
    }
  },
  beforeDestroy () {
    this.$off('block-save', this.save);
    this.$bus.$off('block-editor-trigger-block-save', this.saveIsNeeded);
  }
}
</script>
