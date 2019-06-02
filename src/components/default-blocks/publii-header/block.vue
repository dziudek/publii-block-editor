<template>
  <div>
    <component
      :is="'h' + config.headingLevel"
      contenteditable="true"
      @keyup="getFocusFromTab"
      @keydown="handleKeyboard"
      @paste="pastePlainText"
      @blur="save"
      ref="block"
      :style="'text-align: ' + config.textAlign + ';'"
      class="publii-block-header"
      v-html="content" />

    <transition name="block-editor-ui-fade">
      <div
        class="wrapper-ui-top-menu"
        v-if="$parent.isSelected && !$parent.popupOpened">
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.headingLevel === 2 }"
          tabindex="-1"
          @click.stop="setHeadingLevel(2)">
          <icon name="h2" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.headingLevel === 3 }"
          tabindex="-1"
          @click.stop="setHeadingLevel(3)">
          <icon name="h3" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.headingLevel === 4 }"
          tabindex="-1"
          @click.stop="setHeadingLevel(4)">
          <icon name="h4" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.headingLevel === 5 }"
          tabindex="-1"
          @click.stop="setHeadingLevel(5)">
          <icon name="h5" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.headingLevel === 6 }"
          tabindex="-1"
          @click.stop="setHeadingLevel(6)">
          <icon name="h6" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'left' }"
          tabindex="-1"
          @click.stop="alignText('left')">
          <icon name="align-left" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'center' }"
          tabindex="-1"
          @click.stop="alignText('center')">
          <icon name="align-center" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'right' }"
          tabindex="-1"
          @click.stop="alignText('right')">
          <icon name="align-right" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';

export default {
  name: 'Header',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'icon': EditorIcon
  },
  data () {
    return {
      config: {
        headingLevel: 2,
        textAlign: 'left'
      },
      content: ''
    };
  },
  mounted () {
    this.content = this.inputContent;
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
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
    setHeadingLevel (level) {
      this.save();
      this.config.headingLevel = level;
      this.save();
    },
    save () {
      this.content = this.$refs['block'].innerHTML.replace('<line-separator></line-separator>', '');

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  }
}
</script>

<style scoped lang="scss">
.publii-block-header {
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Insert title';
      opacity: .35;
    }
  }
}
</style>
