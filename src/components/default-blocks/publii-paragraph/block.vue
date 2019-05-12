<template>
  <p
    class="publii-block-paragraph"
    ref="block"
    @keyup="getFocusFromTab"
    contenteditable="true"
    v-html="content" />
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';

export default {
  name: 'Paragraph',
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
      if (e.code === 'Enter' && e.shiftKey === false) {
        let newElementName = this.$parent.$parent.extensions.shortcutManager.checkContentForShortcuts(this.$refs['block'].innerHTML);
        this.$bus.$emit('block-editor-add-block', newElementName, this.id);

        if (newElementName !== 'publii-paragraph') {
          this.$bus.$emit('block-editor-delete-block', this.id);
        }

        e.returnValue = false;
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
.publii-block-paragraph {
  outline: none;

  &:empty {
    &:before {
      content: 'Enter text';
      opacity: .35;
    }
  }
}
</style>
