<script>
import AdvancedConfig from './mixins/AdvancedConfig.vue';

export default {
  name: 'Block',
  mixins: [
    AdvancedConfig
  ],
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
    this.config = Object.assign(this.config, this.inputConfig);
    this.$on('block-save', this.save);
    this.$bus.$on('block-editor-trigger-block-save', this.saveIsNeeded);
  },
  methods: {
    focus (cursorPosition = 'end') {
      let focusElement = this.getFocusableElement();

      if (
        document.activeElement === this.$refs[focusElement] ||
        document.activeElement.parentNode === this.$refs[focusElement].parentNode
      ) {
        return;
      }

      this.$refs[focusElement].focus();

      if (cursorPosition === 'none') {
        return;
      }

      if (cursorPosition === 'end') {
        this.setCursorAtEndOfElement(focusElement, this.isContentEditable(focusElement));
      }

      if (typeof cursorPosition === 'number') {
        this.setCursorAtPosition(cursorPosition);
      }
    },
    isContentEditable (el) {
      let formElements = [
        'INPUT',
        'SELECT',
        'TEXTAREA'
      ];

      if (formElements.indexOf(this.$refs[el].tagName) > -1) {
        return false;
      }

      return true;
    },
    getFocusableElement () {
      if (this.focusable) {
        let focusElement = this.focusable[0];
        return focusElement;
      } else {
        return 'block';
      }
    },
    setCursorAtPosition (position) {
      let el = this.$refs[this.getFocusableElement()];
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
    handleCaret (e, blockRefName = 'block') {
      let cursorPosition = this.getCursorPosition(blockRefName);

      if (
        e.code === 'ArrowUp' && (
          cursorPosition <= 2 ||
          cursorPosition === this.$refs[blockRefName].innerHTML.length ||
          (cursorPosition <= 15 && this.$options.name === 'List')
        )
      ) {
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

      if (
        e.code === 'ArrowDown' && (
          cursorPosition >= this.$refs[blockRefName].innerHTML.length - 5 ||
          (cursorPosition === 0 && this.$options.name === 'Separator') ||
          (cursorPosition === 0 && this.$options.name === 'ReadMore')
        )
      ) {
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
