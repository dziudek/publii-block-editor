<template>
  <div
    class="publii-block-toc-wrapper"
    @keydown="handleKeyboard"
    ref="block"
    contenteditable="true">
    <h2>Table of contents</h2>
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
      let processedHeader;
      let nextLevel;

      if (!headers.length) {
        return '';
      }

      for (let i = 0; i < headers.length; i++) {
        processedHeader = headers[i];
        let headingLevel = processedHeader.config.headingLevel || 2;

        if (headers[i + 1]) {
          nextLevel = headers[i + 1].config.headingLevel;
        }

        if (prevLevel === headingLevel) {
          html += '<li>';
        } else {
          for (let j = prevLevel; j < headingLevel; j++) {
            html += '<ol><li>';
          }
        }

        html += '<a href="#' + processedHeader.id + '">' + processedHeader.content + '</a>';

        if (!nextLevel || nextLevel === headingLevel) {
          html += '</li>';

          if (!nextLevel) {
            html += '</ol>';
          }
        } else {
          for (let j = headingLevel; j > nextLevel; j--) {
            html += '</li></ol><li>';
          }
        }

        prevLevel = headingLevel;
      }

      this.content = html.replace(/<li>[\s]*?<\/li>/gmi, '');
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
  display: block;
  font-size: 16px;
  line-height: 1.4;
  margin: 10px 0;
  padding: 15px 0 15px 20px;
  outline: none;
  width: 100%;

  &-wrapper {
    outline: none;
    width: 100%;

    ol {
      margin: 5px 0;
      padding: 0 0 0 20px;
    }

    h2 {
      margin: 10px 0;
    }

    a {
      pointer-events: none;
    }
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
