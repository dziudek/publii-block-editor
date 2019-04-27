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
  beforeDestroy () {
    this.$off('block-save', this.save);
  }
}
</script>

<style scoped lang="scss">

</style>
