<template>
  <pre
    class="publii-block-code"
    ref="block"
    @keyup="getFocusFromTab"
    @paste="pastePlainText"
    contenteditable="true"
    v-html="content" />
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';

export default {
  name: 'Code',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  data () {
    return {
      config: {},
      content: ''
    };
  },
  mounted () {
    this.content = this.inputContent;
    this.$refs['block'].addEventListener('keydown', this.handleEnterKey);
  },
  methods: {
    handleEnterKey (e) {
      if (e.code === 'Enter' && e.shiftKey === true) {
        let newElementName = this.$parent.$parent.extensions.shortcutManager.checkContentForShortcuts(this.$refs['block'].innerHTML);
        this.$bus.$emit('block-editor-add-block', newElementName, this.id);

        if (newElementName !== 'publii-paragraph') {
          this.$bus.$emit('block-editor-delete-block', this.id);
        }

        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
      }
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
    this.$refs['block'].removeEventListener('keydown', this.handleEnterKey);
  }
}
</script>

<style lang="scss">
.publii-block-code {
  background: #f5f5f5;
  border: 1px solid #eee;
  font-size: 16px;
  line-height: 1.4;
  padding: 15px 20px;
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Enter code';
      opacity: .35;
    }
  }
}
</style>