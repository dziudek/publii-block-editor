<template>
  <div
    class="publii-block-separator"
    contenteditable="true"
    @keyup="getFocusFromTab"
    ref="block">
    <hr />
  </div>
</template>

<script>
import Block from './../../Block.vue';

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
  mounted () {
    this.$refs['block'].addEventListener('keydown', this.handleEnterKey);
  },
  methods: {
    handleEnterKey (e) {
      if (e.code === 'Enter') {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
      }

      if (e.code !== 'Tab') {
        e.returnValue = false;
      }
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleEnterKey);
  }
}
</script>

<style lang="scss">
.publii-block-separator {
  caret-color: transparent;
  margin: 32px 0;
  outline: none;
  width: 100%;
}
</style>
