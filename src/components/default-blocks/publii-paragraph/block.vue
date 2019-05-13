<template>
  <div>
    <p
      class="publii-block-paragraph"
      :style="'text-align: ' + config.textAlign + ';'"
      ref="block"
      slot="block"
      @keyup="getFocusFromTab"
      @paste="pastePlainText"
      contenteditable="true"
      v-html="content">
    </p>

    <div
      class="wrapper-ui-top-menu"
      v-if="$parent.isSelected">
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'left' }"
        tabindex="-1"
        @click.stop="alignText('left')">«</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'center' }"
        tabindex="-1"
        @click.stop="alignText('center')">=</button>
      <button
        :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'right' }"
        tabindex="-1"
        @click.stop="alignText('right')">»</button>
    </div>
  </div>
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
      config: {
        textAlign: 'left'
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
        let newElementName = this.$parent.$parent.extensions.shortcutManager.checkContentForShortcuts(this.$refs['block'].innerHTML);
        this.$bus.$emit('block-editor-add-block', newElementName, this.id);

        if (newElementName !== 'publii-paragraph') {
          this.$bus.$emit('block-editor-delete-block', this.id);
        }

        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    alignText (position) {
      this.config.textAlign = position;
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

<style lang="scss">
.publii-block-paragraph {
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Enter text';
      opacity: .35;
    }
  }
}
</style>
