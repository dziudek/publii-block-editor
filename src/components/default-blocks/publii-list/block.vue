<template>
  <component
    :is="config.listType"
    contenteditable="true"
    v-html="content"
    ref="block"
    class="publii-block-list" />
</template>

<script>
import Block from './../../Block.vue';

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

    if (!this.inputContent) {
      this.content = '<li></li>';
    }

    this.$refs['block'].addEventListener('keydown', this.handleTabKey);
  },
  methods: {
    handleTabKey (e) {
      if (
        e.code === 'Backspace' &&
        (
          this.$refs['block'].innerHTML === '<li></li>' ||
          this.$refs['block'].innerHTML === '<li><br></li>'
        )
      ) {
        e.returnValue = false;
      }

      if (e.code === 'Enter' && this.$refs['block'].innerHTML.substr(-13) === '<li><br></li>') {
        e.returnValue = false;
      }

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
</script>

<style lang="scss">
.publii-block-list {
  outline: none;
}
</style>
