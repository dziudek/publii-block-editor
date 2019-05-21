<template>
  <div
    class="publii-block-toc-wrapper"
    @keydown="handleKeyboard"
    ref="block"
    contenteditable="true">
    <ol
      class="publii-block-toc"
      v-html="content">
    </ol>
  </div>
</template>

<script>
import Block from './../../Block.vue';

export default {
  name: 'ToC',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {},
      content: ''
    };
  },
  computed: {

  },
  mounted () {
    this.content = this.inputContent;
    this.view = this.content === '' ? 'code' : 'preview';
    this.$bus.$on('block-editor-content-updated', this.updateToc);
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter') {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Backspace') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (e.code !== 'Tab') {
        e.returnValue = false;
      }
    },
    updateToc () {
      let headers = this.$parent.$parent.content.filter(block => block.type === 'publii-header');
      console.log(headers);
    },
    save () {
      this.content = this.$refs['block'].innerHTML;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-content-updated', this.updateToc);
  }
}
</script>

<style lang="scss">
.publii-block-toc {
  caret-color: transparent;
  font-size: 16px;
  line-height: 1.4;
  padding: 15px 20px;
  outline: none;
  width: 100%;

  &-wrapper {
    width: 100%;
  }

  &:empty {
    &:before {
      content: 'Put headers to generate Table of Contents';
      display: block;
      opacity: .35;
      text-align: center;
      width: 100%;
    }
  }
}
</style>
