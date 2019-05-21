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
        ⨁
      </button>

      <div
        v-if="newBlockUIListVisible"
        :class="{ 'publii-block-paragraph-block-selector-list': true, 'is-visible': true }">
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 0 }"
          @click.stop="addNewBlock('publii-header');">
          H
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 1 }"
          @click.stop="addNewBlock('publii-code');">
          C
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 2 }"
          @click.stop="addNewBlock('publii-separator');">
          HR
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 3 }"
          @click.stop="addNewBlock('publii-list');">
          UL
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 4 }"
          @click.stop="addNewBlock('publii-quote');">
          Q
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 5 }"
          @click.stop="addNewBlock('publii-readmore');">
          RM
          </button>
      </div>
    </div>

    <div
      class="wrapper-ui-inline-menu"
      ref="inline-menu"
      v-if="$parent.isSelected && textIsHighlighted"
      :key="'inline-menu-' + id">
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.bold }"
        @click.stop="doInlineOperation('strong');">
        B
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.italic }"
        @click.stop="doInlineOperation('em');">
        I
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.underline }"
        @click.stop="doInlineOperation('u');">
        U
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.strikethrough }"
        @click.stop="doInlineOperation('s');">
        S
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.code }"
        @click.stop="doInlineOperation('code');">
        &lt;&gt;
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': selectedTextContains.mark }"
        @click.stop="doInlineOperation('mark');">
        M
      </button>
    </div>

    <div
      class="wrapper-ui-top-menu"
      :key="'top-menu-' + id"
      v-if="$parent.isSelected && !textIsHighlighted">
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
import InlineMenu from './../../helpers/InlineMenu.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements,
    InlineMenu
  ],
  data () {
    return {
      config: {
        textAlign: 'left'
      },
      selectedTextContains: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        mark: false,
        link: false
      },
      content: '',
      showNewBlockUI: false,
      newBlockUIActiveIndex: 0,
      newBlockUIListVisible: false,
      textIsHighlighted: true
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
      setTimeout(() => {
        if (!this.newBlockUIListVisible) {
          this.showNewBlockUI = false;
        }
      }, 250);
    },
    handleMouseUp (e) {
      setTimeout(() => {
        let sel = window.getSelection();

        if (sel.isCollapsed) {
          this.textIsHighlighted = false;
        } else {
          this.textIsHighlighted = !sel.isCollapsed || (sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset);
        }

        if (this.textIsHighlighted) {
          setTimeout(() => {
            this.showInlineMenu();
          }, 0);
        }
      }, 0);
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
      let selectedObject = window.getSelection();
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
.publii-block-paragraph {
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

    &-list {
      display: none;
      left: 30px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 500px;

      &-button {
        margin-right: 5px;

        &.is-active {
          background: #f0f0f0;
        }
      }

      &.is-visible {
        display: block;
      }
    }
  }
}
</style>
