<script>
export default {
  name: 'Block',
  props: [
    'id',
    'inputContent',
    'inputConfig'
  ],
  mounted () {
    this.$on('block-save', this.save);
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
    },
    setCursorAtPosition (position) {
      let el = this.$refs['block'];
      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart(el.firstChild, position);
      range.setEnd(el.firstChild, position);
      sel.removeAllRanges();
      sel.addRange(range);
    },
    setCursorAtEndOfElement (id = 'block') {
      let range = document.createRange();
      range.selectNodeContents(this.$refs[id]);
      range.collapse(false);

      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
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
    }
  },
  beforeDestroy () {
    this.$off('block-save', this.save);
  }
}
</script>
