<template>
  <div class="publii-block-image-wrapper">
    <div
      :class="{ 'publii-block-image': true, 'is-visible': view === 'code' }"
      ref="block">
      <textarea
        @keydown="handleKeyboard"
        @blur="save"
        ref="code"
        placeholder="Enter URL or embed code..."
        v-model="content"></textarea>
    </div>
    <div
      v-if="view === 'preview'"
      v-html="modifiedContent"
      :class="{ 'publii-block-image-preview': true }">
    </div>
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import HasPreview from './../../mixins/HasPreview.vue';

export default {
  name: 'PImage',
  mixins: [
    Block,
    ContentEditableImprovements,
    HasPreview
  ],
  data () {
    return {
      config: {},
      content: ''
    };
  },
  computed: {
    modifiedContent () {
      return this.content;
    }
  },
  mounted () {
    this.content = this.inputContent;
    this.view = this.content === '' ? 'code' : 'preview';
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.content === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
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
  }
}
</script>

<style lang="scss">
.publii-block-image {
  background: #eee;
  border: 1px solid #ccc;
  color: #ccc;
  display: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 15px 20px;
  outline: none;
  width: 100%;

  textarea {
    background: #fff;
    border: 1px solid #ccc;
    font-family: monospace;
    font-size: 16px;
    padding: 10px 20px;
    width: 100%;
  }

  &.is-visible {
    display: block;
  }

  &-preview {
    background: #f0f0f0;
    margin: 0;
    padding: 0 0 56.25% 0;
    position: relative;

    iframe {
      height: 100%;
      pointer-events: none;
      position: absolute;
      width: 100%;
    }
  }
}
</style>
