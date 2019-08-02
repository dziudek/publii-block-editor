<template>
  <div
    @click="hide()"
    class="block-advanced-config-overlay">
    <div class="block-advanced-config">

    </div>
  </div>
</template>

<script>
export default {
  name: 'block-advanced-config',
  data () {
    return {
      isVisible: false,
      currentBlockID: '',
      config: {},
      configForm: []
    };
  },
  mounted () {
    this.$bus.$on('block-editor-show-advanced-config', this.show);
  },
  methods: {
    show (blockID, config, configForm) {
      this.isVisible = true;
    },
    hide () {
      this.isVisible = false;
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-show-advanced-config', this.show);
  }
};
</script>

<style lang="scss">
.block-advanced-config {
  &-advanced {

  }
}
</style>
