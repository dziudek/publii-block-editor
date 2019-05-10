<template>
  <component
    :is="'h' + config.headingLevel"
    contenteditable="true"
    ref="block"
    v-html="content" />
</template>

<script>
import Block from './../Block.vue';
import ContentEditableImprovements from './../helpers/ContentEditableImprovements.vue';

export default {
  name: 'Header',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  data () {
    return {
      config: {
        headingLevel: 2
      },
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
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
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

// window.publiiBlockEditorInstance.$bus.$emit('block-editor-shortcut-manager-add-shortcut', '/header', 'publii-header');
</script>

<style scoped lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  outline: none;

  &:empty {
    &:before {
      content: 'Insert title';
      opacity: .35;
    }
  }
}
</style>
