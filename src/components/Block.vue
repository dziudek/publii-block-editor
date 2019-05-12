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
    }
  },
  beforeDestroy () {
    this.$off('block-save', this.save);
  }
}
</script>

<style scoped lang="scss">

</style>
