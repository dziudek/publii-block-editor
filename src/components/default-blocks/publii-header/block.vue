<template>
  <component
    :is="'h' + config.headingLevel"
    contenteditable="true"
    @keyup="getFocusFromTab"
    @paste="pastePlainText"
    ref="block"
    class="publii-block-header"
    v-html="content" />
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';

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
    this.$refs['block'].addEventListener('keydown', this.handleKeyboard);
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
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
    this.$refs['block'].removeEventListener('keydown', this.handleKeyboard);
  }
}
</script>

<style scoped lang="scss">
.publii-block-header {
  outline: none;

  &:empty {
    &:before {
      content: 'Insert title';
      opacity: .35;
    }
  }
}
</style>
