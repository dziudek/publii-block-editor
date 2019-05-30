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
      @mouseup="handleMouseUp"
      contenteditable="true"
      v-html="content">
    </p>

    <div
      :class="{ 'publii-block-paragraph-block-selector': true, 'is-visible': showNewBlockUI }"
      :key="'new-block-menu-' + id">
      <button
        @click.stop="toggleNewBlockUI()"
        tabindex="-1">
        <icon
          height="12"
          name="add"
          width="12" />
      </button>

      <div
        v-if="newBlockUIListVisible"
        :class="{ 'publii-block-paragraph-block-selector-list': true, 'is-visible': true }">
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 0 }"
          @click.stop="addNewBlock('publii-header');">
          <icon
            height="14"
            name="headings"
            width="10" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 1 }"
          @click.stop="addNewBlock('publii-list');">
          <icon
            height="12"
            name="unordered-list"
            width="16" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 2 }"
          @click.stop="addNewBlock('publii-quote');">
          <icon
            height="12"
            name="quote"
            width="14" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 3 }"
          @click.stop="addNewBlock('publii-code');">
          <icon
            height="12"
            name="code"
            width="14" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 4 }"
          @click.stop="addNewBlock('publii-html');">
          <icon
            height="12"
            name="html"
            width="18" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 5 }"
          @click.stop="addNewBlock('publii-separator');">
          <icon
            height="2"
            name="separator"
            width="16" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 6 }"
          @click.stop="addNewBlock('publii-readmore');">
          <icon
            height="12"
            name="readmore"
            width="16" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 7 }"
          @click.stop="addNewBlock('publii-embed');">
          <icon
            height="14"
            name="video"
            width="18" />
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 8 }"
          @click.stop="addNewBlock('publii-toc');">
          <icon
            height="12"
            name="toc"
            width="16" />
        </button>
      </div>
    </div>

    <inline-menu ref="inline-menu" />

    <transition name="block-editor-ui-fade">
      <div
        class="wrapper-ui-top-menu"
        :key="'top-menu-' + id"
        v-if="$parent.isSelected && !textIsHighlighted && !$parent.popupOpened">
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'left' }"
          tabindex="-1"
          @click.stop="alignText('left')">
          <icon
            height="12"
            name="align-left"
            width="14" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'center' }"
          tabindex="-1"
          @click.stop="alignText('center')">
          <icon
            height="12"
            name="align-center"
            width="14" />
        </button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': this.config.textAlign === 'right' }"
          tabindex="-1"
          @click.stop="alignText('right')">
          <icon
            height="12"
            name="align-right"
            width="14" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import InlineMenu from './../../helpers/InlineMenu.vue';
import InlineMenuUI from './../../helpers/InlineMenuUI.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements,
    InlineMenu
  ],
  components: {
    'icon': EditorIcon,
    'inline-menu': InlineMenuUI
  },
  data () {
    return {
      config: {
        textAlign: 'left'
      },
      content: '',
      showNewBlockUI: false,
      newBlockUIActiveIndex: 0,
      newBlockUIListVisible: false
    };
  },
  mounted () {
    this.content = this.inputContent;
    this.$bus.$on('block-editor-deselect-blocks', this.deselectBlock);
  },
  methods: {
    refresh () {
      this.$refs['block'].innerHTML = this.content;
    },
    handleEditFocus () {
      if (this.$refs['block'].innerHTML === '') {
        this.showNewBlockUI = true;
      }
    },
    handleEditBlur (e) {
      if (e.relatedTarget && e.relatedTarget.classList.contains('wrapper-ui-inline-menu-button')) {
        return;
      }

      this.save();

      setTimeout(() => {
        if (!this.newBlockUIListVisible) {
          this.showNewBlockUI = false;
        }
      }, 250);
    },
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false && this.showNewBlockUI === false) {
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

          this.save();
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

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML !== '' && this.cursorIsAtTheBeginning()) {
        this.mergeParagraphs();
        e.returnValue = false;
      }

      if (e.code === 'Tab' && this.$refs['block'].innerHTML === '' && this.newBlockUIListVisible === false) {
        this.toggleNewBlockUI();
        this.newBlockUIActiveIndex = 0;
        e.returnValue = false;
        return;
      }

      if (e.code === 'Tab' && this.$refs['block'].innerHTML === '' && this.newBlockUIListVisible === true) {
        this.newBlockUIActiveIndex++;

        if (this.newBlockUIActiveIndex > this.$refs['block'].parentNode.querySelectorAll('.publii-block-paragraph-block-selector-list-button').length - 1) {
          this.newBlockUIActiveIndex = 0;
        }

        e.returnValue = false;
        return;
      }

      if (
        e.code === 'Enter' &&
        e.shiftKey === false &&
        this.newBlockUIListVisible === true &&
        this.showNewBlockUI === true
      ) {
        this.$refs['block'].parentNode.querySelectorAll('.publii-block-paragraph-block-selector-list-button')[this.newBlockUIActiveIndex].click();
        e.returnValue = false;
        return;
      }

      if (this.blockUIVisible) {
        this.blockUIVisible = false;
      }
    },
    handleKeyUp (e) {
      if (!this.showNewBlockUI && this.$refs['block'].innerHTML === '') {
        this.showNewBlockUI = true;
      } else if (this.showNewBlockUI && this.$refs['block'].innerHTML !== '') {
        this.showNewBlockUI = false;
      }
    },
    alignText (position) {
      this.config.textAlign = position;
    },
    mergeParagraphs () {
      this.save();

      setTimeout(() => {
        this.$bus.$emit('block-editor-merge-paragraphs', this.id);
      }, 0);
    },
    save () {
      this.content = this.$refs['block'].innerHTML;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    },
    cursorIsAtTheBeginning () {
      let selectedObject = document.getSelection();
      return selectedObject.rangeCount === 1 && selectedObject.baseOffset === 0;
    },
    /**
     * New block UI methods
     */
    deselectBlock (blockID) {
      if (blockID !== this.id) {
        this.showNewBlockUI = false;
        this.newBlockUIListVisible = false;
      }
    },
    toggleNewBlockUI () {
      this.showNewBlockUI = true;
      this.newBlockUIListVisible = !this.newBlockUIListVisible;
    },
    addNewBlock (blockType) {
      this.$bus.$emit('block-editor-add-block', blockType, this.id);
      this.$bus.$emit('block-editor-delete-block', this.id);
      this.toggleNewBlockUI();
    },
    hideNewBlockUI (blockID) {
      this.showNewBlockUI = false;
      this.newBlockUIListVisible = false;
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-deselect-blocks', this.deselectBlock);
  }
}
</script>

<style lang="scss">
@import '../../../assets/variables.scss';

.publii-block-paragraph {
  line-height: 1.4;
  outline: none;
  width: 100%;

  code,
  mark {
    display: inline;
  }

  &:empty {
    &:before {
      content: 'Enter text';
      opacity: .35;
    }
  }

  &-block-selector {
    display: none;
    left: -30px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.is-visible {
      display: block;
    }

    & > button {
      background: transparent;
      border: none;
      outline: none;
    }

    &-list {
      display: none;
      left: 30px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 500px;

      &-button {
        align-items: center;
        background: transparent;
        border: none;
        display: flex;
        margin-right: 5px;
        outline: none;

        &.is-active {
          color: $block-editor-color-primary-dark;
        }
      }

      &.is-visible {
        background: $block-editor-color-light;
        display: flex;
      }
    }
  }
}
</style>
