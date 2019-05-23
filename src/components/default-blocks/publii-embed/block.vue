<template>
  <div class="publii-block-embed-wrapper">
    <div
      :class="{ 'publii-block-embed': true, 'is-visible': view === 'code' }"
      ref="block">
      <textarea
        @keydown="handleKeyboard"
        @blur="save"
        ref="code"
        v-model="content"></textarea>
    </div>
    <div
      v-if="view === 'preview'"
      v-html="modifiedContent"
      :class="{ 'publii-block-embed-preview': true }">
    </div>
    <div
      class="wrapper-ui-top-menu"
      :key="'top-menu-' + id"
      v-if="$parent.isSelected && content.trim() !== ''">
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.view === 'code' }"
        tabindex="-1"
        @click.stop="setView('code')">Code</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.view === 'preview' }"
        tabindex="-1"
        @click.stop="setView('preview')">Preview</button>
    </div>
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import embedHelper from './embed.js';

export default {
  name: 'Embed',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  data () {
    return {
      config: {},
      content: '',
      view: 'code'
    };
  },
  computed: {
    modifiedContent () {
      if (embedHelper.isEmbedable(this.content)) {
        return embedHelper.embed(this.content, this.$bus, this.id);
      }

      return this.content;
    }
  },
  mounted () {
    this.content = this.inputContent;
    this.view = this.content === '' ? 'code' : 'preview';
    this.$bus.$on('block-editor-deselect-blocks', this.deselectBlock);
    this.$bus.$on('block-editor-block-selected', this.selectBlock);
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
    setView (newView) {
      if (
        this.view === 'code' &&
        newView === 'preview'
      ) {
        this.save();
      }

      if (
        this.content === '' &&
        newView === 'preview'
      ) {
        this.view = 'code';
      } else {
        setTimeout(() => {
          this.view = newView;
        }, 0);
      }
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    },
    selectBlock (id) {
      if (this.$parent.isSelected) {
        return;
      }

      this.setView('preview');
    },
    deselectBlock (id) {
      if (this.id !== id) {
        this.setView('preview');
      }
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-deselect-blocks', this.deselectBlock);
    this.$bus.$off('block-editor-block-selected', this.selectBlock);
  }
}
</script>

<style lang="scss">
.publii-block-embed {
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
