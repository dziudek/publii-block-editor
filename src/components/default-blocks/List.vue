<template>
  <component
    :is="config.listType"
    contenteditable="true"
    v-html="content"
    ref="block" />
</template>

<script>
import Block from './../Block.vue';

export default {
  name: 'List',
  mixins: [
    Block
  ],
  data () {
    return {
      config: {
        listType: 'ul'
      },
      content: '<li></li>'
    };
  },
  mounted () {
    this.content = this.inputContent;
    this.$refs['block'].addEventListener('keydown', this.handleTabKey);
  },
  methods: {
    handleTabKey (e) {
      if (e.code === 'Tab' && e.shiftKey === false) {
        document.execCommand('indent', false, null);
        e.returnValue = false;
      } else if (e.code === 'Tab' && e.shiftKey === true) {
        document.execCommand('outdent', false, null);
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
  }
}

window.publiiBlockEditorInstance.$bus.$emit('block-editor-shortcut-manager-add-shortcut', '/list', 'publii-list');
</script>

<style scoped lang="scss">
ul,
ol {
  outline: none;
}
</style>
