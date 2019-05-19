<template>
  <div>
    <component
      :is="config.listType"
      contenteditable="true"
      @keyup="getFocusFromTab"
      @paste="pastePlainText"
      @keydown="handleKeyboard"
      v-html="content"
      ref="block"
      class="publii-block-list" />

    <div
      class="wrapper-ui-top-menu"
      v-if="$parent.isSelected">
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.listType === 'ul' }"
        tabindex="-1"
        @click.stop="setListType('ul')">ul</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.listType === 'ol' }"
        tabindex="-1"
        @click.stop="setListType('ol')">ol</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true }"
        tabindex="-1"
        @click.stop="indentList()">⇉</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true }"
        tabindex="-1"
        @click.stop="outdentList()">⇇</button>
    </div>
  </div>
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
  },
  methods: {
    handleKeyboard (e) {
      if (
        e.code === 'Backspace' &&
        (
          this.$refs['block'].innerHTML === '<li></li>' ||
          this.$refs['block'].innerHTML === '<li><br></li>'
        )
      ) {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (
        e.code === 'Enter' &&
        (
          (
            this.$refs['block'].innerHTML.substr(-13) === '<li><br></li>' ||
            this.$refs['block'].innerHTML.substr(-9) === '<li></li>'
          ) && this.$refs['block'].querySelectorAll('li').length > 1
        )
      ) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        this.$refs['block'].innerHTML = this.$refs['block'].innerHTML.substr(0, this.$refs['block'].innerHTML.length - 13);
        e.returnValue = false;
      }
    },
    setListType (type) {
      this.save();
      this.config.listType = type;
    },
    indentList () {
      document.execCommand('indent', false, null);

      setTimeout(() => {
        if (
          this.$refs['block'].innerHTML.indexOf('<ul><ul>') > -1 ||
          this.$refs['block'].innerHTML.indexOf('<ol><ol>') > -1
        ) {
          document.execCommand('undo', false, null);
        }
      }, 0);
    },
    outdentList () {
      document.execCommand('outdent', false, null);
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
  width: 100%;

  li {
    width: 100%;
  }
}
</style>
