<template>
  <div>
    <p
      class="publii-block-paragraph"
      :style="'text-align: ' + config.textAlign + ';'"
      ref="block"
      slot="block"
      @focus="handleEditFocus"
      @blur="handleEditBlur"
      @keyup="getFocusFromTab($event); handleKeyUp($event); handleCaret($event)"
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
        <icon name="add" />
      </button>

      <div
        v-if="!newBlockUIListVisible"
        class="publii-block-paragraph-block-selector-tooltip">
        <span class="publii-block-paragraph-block-selector-tooltip-label1">
          Add
        </span>
        <span class="publii-block-paragraph-block-selector-tooltip-label2">
          <icon name="tab" /> Tab
        </span>
      </div>

      <div
        v-if="newBlockUIListVisible"
        :class="{ 'publii-block-paragraph-block-selector-list': true, 'is-visible': true }">
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 0 }"
          @click.stop="addNewBlock('publii-header');">
          <icon name="headings" />
          <div
            v-if="newBlockUIActiveIndex === 0"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Header
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 1 }"
          @click.stop="addNewBlock('publii-image');">
          <icon name="image" />
          <div
            v-if="newBlockUIActiveIndex === 1"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Image
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 2 }"
          @click.stop="addNewBlock('publii-list');">
          <icon name="unordered-list" />
          <div
            v-if="newBlockUIActiveIndex === 2"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              List
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 3 }"
          @click.stop="addNewBlock('publii-quote');">
          <icon name="quote" />
          <div
            v-if="newBlockUIActiveIndex === 3"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Quote
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 4 }"
          @click.stop="addNewBlock('publii-code');">
          <icon name="code" />
          <div
            v-if="newBlockUIActiveIndex === 4"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Code
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 5 }"
          @click.stop="addNewBlock('publii-html');">
          <icon name="html" />
          <div
            v-if="newBlockUIActiveIndex === 5"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Custom HTML code
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 6 }"
          @click.stop="addNewBlock('publii-separator');">
          <icon name="separator" />
          <div
            v-if="newBlockUIActiveIndex === 6"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Separator
            </span>
          </div>
        </button>
        <button
          v-if="!editor.hasReadMore"
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === 7 }"
          @click.stop="addNewBlock('publii-readmore');">
          <icon name="readmore" />
          <div
            v-if="newBlockUIActiveIndex === 7"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Readmore
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === (!editor.hasReadMore ? 8 : 7) }"
          @click.stop="addNewBlock('publii-embed');">
          <icon name="video" />
          <div
            v-if="newBlockUIActiveIndex === (!editor.hasReadMore ? 8 : 7)"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Video
            </span>
          </div>
        </button>
        <button
          :class="{ 'publii-block-paragraph-block-selector-list-button': true, 'is-active': newBlockUIActiveIndex === (!editor.hasReadMore ? 9 : 8) }"
          @click.stop="addNewBlock('publii-toc');">
          <icon name="toc" />
          <div
            v-if="newBlockUIActiveIndex === (!editor.hasReadMore ? 9 : 8)"
            class="publii-block-paragraph-block-selector-tooltip is-small">
            <span class="publii-block-paragraph-block-selector-tooltip-label1">
              Table of Contents
            </span>
          </div>
        </button>
      </div>
    </div>

    <inline-menu ref="inline-menu" />

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import InlineMenu from './../../mixins/InlineMenu.vue';
import InlineMenuUI from './../../helpers/InlineMenuUI.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements,
    InlineMenu
  ],
  components: {
    'icon': EditorIcon,
    'inline-menu': InlineMenuUI,
    'top-menu': TopMenuUI
  },
  data () {
    return {
      config: {
        textAlign: 'left'
      },
      content: '',
      showNewBlockUI: false,
      newBlockUIActiveIndex: 0,
      newBlockUIListVisible: false,
      topMenuConfig: [
        {
          activeState: function () { return this.config.textAlign === 'left'; },
          onClick: function () { this.alignText('left'); },
          icon: 'align-left'
        },
        {
          activeState: function () { return this.config.textAlign === 'center'; },
          onClick: function () { this.alignText('center'); },
          icon: 'align-center'
        },
        {
          activeState: function () { return this.config.textAlign === 'right'; },
          onClick: function () { this.alignText('right'); },
          icon: 'align-right'
        }
      ]
    };
  },
  watch: {
    showNewBlockUI (newValue, oldValue) {
      if (newValue) {
        this.$parent.addCustomCssClass('has-block-selector-visible');
      } else {
        this.$parent.removeCustomCssClass('has-block-selector-visible');
      }
    }
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

        if (newElementName === 'publii-readmore' && this.editor.hasReadMore) {
          alert('You can add only one read more per post.');
          e.returnValue = false;
          return;
        }

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
        return;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML !== '' && this.cursorIsAtTheBeginning()) {
        this.mergeParagraphs();
        e.returnValue = false;
        return;
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
        this.newBlockUIListVisible === false &&
        this.showNewBlockUI === true
      ) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
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
    toggleNewBlockUIIcon () {
      setTimeout(() => {
        this.showNewBlockUI = true;
      }, 0);
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
    left: -16px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;

    &-tooltip {
      background: $color-editor-color-light-medium;
      border-radius: $block-editor-form-input-border-radius;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .16);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      height: 40px;
      left: 50%;
      padding: 5px 0;
      position: absolute;
      top: 30px;
      transform: translateX(-50%);
      width: 64px;
      z-index: 10;

      &.is-small {
        color: $block-editor-color-text;
        display: block;
        height: auto;
        padding: 5px 10px;
        width: auto;

        .publii-block-paragraph-block-selector-tooltip-label1 {
          height: auto;
        }
      }

      &:after {
        border: 6px solid $color-editor-color-light-medium;
        border-left-color: transparent;
        border-right-color: transparent;
        border-top-color: transparent;
        content: "";
        filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .08));
        height: 12px;
        left: 50%;
        position: absolute;
        top: -12px;
        transform: translateX(-50%);
        width: 12px;
      }

      &-label1,
      &-label2 {
        align-items: center;
        display: flex;
        font-size: 13px;
        height: 13px;
        justify-content: center;
        line-height: 1;
        width: 100%;
      }

      &-label2 {
        opacity: .3;

        svg {
          margin-right: 3px;
        }
      }
    }

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
        position: relative;

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
