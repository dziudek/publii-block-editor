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
    focus (setCursorAtEnd = true) {
      this.$refs['block'].focus();

      if (setCursorAtEnd) {
        this.setCursorAtEndOfElement();
      }
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
