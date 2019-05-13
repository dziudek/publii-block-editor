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
    focus () {
      this.$refs['block'].focus();
    },
    getFocusFromTab () {
      if (!this.$parent.isSelected) {
        this.$bus.$emit('block-editor-block-selected', this.id);
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
