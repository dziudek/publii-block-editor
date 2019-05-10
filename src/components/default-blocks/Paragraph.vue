<template>
  <p
    ref="block"
    contenteditable="true"
    v-html="content" />
</template>

<script>
import Block from './../Block.vue';
import ContentEditableImprovements from './../helpers/ContentEditableImprovements.vue';

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
        let newElementName = this.checkContentForShortcuts();
        this.$bus.$emit('block-editor-add-block', 'publii-' + newElementName, this.id);

        if (newElementName !== 'paragraph') {
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
    },
    checkContentForShortcuts () {
      let text = this.$refs['block'].innerHTML;

      if (text !== '' && text[0] === '/') {
        switch (text) {
          case '/separator': return 'separator';
          case '/header': return 'header';
          case '/list': return 'list';
          case '/quote': return 'quote';
        }
      }

      return 'paragraph';
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleEnterKey);
  }
}
</script>

<style scoped lang="scss">
p {
  outline: none;

  &:empty {
    &:before {
      content: 'Enter text';
      opacity: .35;
    }
  }
}
</style>
