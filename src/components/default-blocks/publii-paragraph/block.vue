<template>
  <div>
    <p
      class="publii-block-paragraph"
      :style="'text-align: ' + config.textAlign + ';'"
      ref="block"
      slot="block"
      @focus="handleEditFocus"
      @blur="handleEditBlur"
      @keyup="getFocusFromTab($event); handleKeyUp($event);"
      @paste="pastePlainText"
      @keydown="handleKeyboard"
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
      content: '',
      blockUIVisible: false
    };
  },
  mounted () {
    this.content = this.inputContent;
  },
  methods: {
    handleEditFocus () {
      if (this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-toggle-new-block-ui-in-wrapper', this.id, true);
        this.blockUIVisible = true;
      }
    },
    handleEditBlur () {
      this.$bus.$emit('block-editor-toggle-new-block-ui-in-wrapper', this.id, false);
      this.blockUIVisible = false;
    },
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        let newElementName = this.$parent.$parent.extensions.shortcutManager.checkContentForShortcuts(this.$refs['block'].innerHTML);

        if (newElementName === 'publii-paragraph') {
          document.execCommand('insertHTML', false, '<line-separator />');

          if (this.$refs['block'].innerHTML.substr(-33) === '<line-separator></line-separator>') {
            this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
            this.$refs['block'].innerHTML = this.$refs['block'].innerHTML.replace('<line-separator></line-separator>', '');
          } else {
            let separatedContent = this.$refs['block'].innerHTML.split('<line-separator></line-separator>');
            let firstPart = separatedContent[0];
            let secondPart = separatedContent[1];

            if (secondPart.substr(0, 4) === '<br>') {
              secondPart = secondPart.substr(4);
            }

            this.$refs['block'].innerHTML = firstPart;
            this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id, secondPart);
          }
        } else {
          this.$bus.$emit('block-editor-add-block', newElementName, this.id);
          this.$bus.$emit('block-editor-delete-block', this.id);
        }

        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (this.blockUIVisible) {
        this.blockUIVisible = false;
        this.$bus.$emit('block-editor-toggle-new-block-ui-in-wrapper', this.id, false);
      }
    },
    handleKeyUp (e) {
      if (!this.blockUIVisible && this.$refs['block'].innerHTML === '') {
        this.blockUIVisible = true;
        this.$bus.$emit('block-editor-toggle-new-block-ui-in-wrapper', this.id, true);
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
