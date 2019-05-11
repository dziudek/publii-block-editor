<template>
  <hr
    ref="block"
    class="publii-block-separator" />
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
</script>

<style lang="scss">
.publii-block-separator {
  margin: 32px 0;
}
</style>
