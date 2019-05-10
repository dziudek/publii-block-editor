<template>
  <hr ref="block" />
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'Separator',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {},
      content: ''
    };
  },
  mounted () {},
  methods: {
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  }
}

// window.publiiBlockEditorInstance.$bus.$emit('block-editor-shortcut-manager-add-shortcut', '/separator', 'publii-separator');
</script>

<style scoped lang="scss">
hr {
  margin: 32px 0;
}
</style>
