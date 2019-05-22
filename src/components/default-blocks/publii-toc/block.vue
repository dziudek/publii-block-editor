<template>
  <div
    class="publii-block-toc-wrapper"
    @keydown="handleKeyboard"
    ref="block"
    contenteditable="true">
    <ol
      class="publii-block-toc"
      ref="content"
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
    this.updateToc();
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

      if (headers.length === 0) {
        this.content = '';
        return;
      }

      let html = '';
      let prevLevel = 2;
      let i, ii, h, nextLevel;

      if (!headers.length) {
        return '';
      }

      for (i = 0; i < headers.length; i++) {
        h = headers[i];
        nextLevel = headers[i + 1] && headers[i + 1].config.headingLevel;

        if (prevLevel === h.config.headingLevel) {
          html += '<li>';
        } else {
          for (ii = prevLevel; ii < h.config.headingLevel; ii++) {
            html += '<ul><li>';
          }
        }

        html += '<a href="#' + h.id + '">' + h.content + '</a>';

        if (nextLevel === h.config.headingLevel || !nextLevel) {
          html += '</li>';

          if (!nextLevel) {
            html += '</ul>';
          }
        } else {
          for (ii = h.config.headingLevel; ii > nextLevel; ii--) {
            html += '</li></ul><li>';
          }
        }

        prevLevel = h.config.headingLevel;
      }

      this.content = html;
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
