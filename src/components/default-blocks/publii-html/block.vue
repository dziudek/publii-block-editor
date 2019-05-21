<template>
  <div>
    <pre
      :class="{ 'publii-block-html': true, 'is-visible': view === 'code' }"
      ref="block"
      @paste="pastePlainText"
      @keydown="handleKeyboard"
      contenteditable="true"
      v-html="content" />
    <div
      v-if="view === 'preview'"
      v-html="modifiedContent"
      @click="setView('code')"
      class="publii-block-html-preview">
    </div>
    <div
      class="wrapper-ui-top-menu"
      :key="'top-menu-' + id"
      v-if="$parent.isSelected">
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

export default {
  name: 'Html',
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
      return this.content.replace(/&gt;/gmi, '>').replace(/&lt;/gmi, '<').replace(/&nbsp;/gmi, '&');
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
      if (e.code === 'Enter' && e.shiftKey === true) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    setView (newView) {
      if (this.view === 'code' && newView === 'preview') {
        this.save();
      }

      if (this.$refs['block'].innerHTML === '' && newView === 'preview') {
        this.view = 'code';
      } else {
        setTimeout(() => {
          this.view = newView;
        }, 0);
      }
    },
    save () {
      this.content = this.$refs['block'].innerHTML;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    },
    selectBlock (id) {
      if (this.id === id) {
        this.setView('code');
      } else {
        this.setView('preview');
      }
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
.publii-block-html {
  background: #202020;
  border: 1px solid #111;
  color: #ccc;
  display: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 15px 20px;
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Enter HTML code';
      opacity: .35;
    }
  }

  &.is-visible {
    display: block;
  }

  &-preview {
    padding: 15px 0;
  }
}
</style>
