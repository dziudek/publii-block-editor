<template>
  <div
    v-if="showInlineMenu"
    class="wrapper-ui-inline-menu"
    :style="'left: ' + left + '; top: ' + top + ';'"
    :key="'inline-menu-' + $parent.id">
    <div class="wrapper-ui-inline-menu-buttons">
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.strong }"
        @click.stop="$parent.doInlineOperation('strong');">
        <icon name="bold" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.em }"
        @click.stop="$parent.doInlineOperation('em');">
        <icon name="italic" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.u }"
        @click.stop="$parent.doInlineOperation('u');">
        <icon name="underline" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.s }"
        @click.stop="$parent.doInlineOperation('s');">
        <icon name="strikethrough" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.a }"
        @click.stop="$parent.showLinkPopup();">
        <icon name="link" />
      </button>
      <button
        v-if="$parent.selectedText.containedTags.a"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        @click.stop="$parent.doInlineOperation('unlink');">
        <icon name="unlink" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.code }"
        @click.stop="$parent.doInlineOperation('code');">
        <icon name="code" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedText.containedTags.mark }"
        @click.stop="$parent.doInlineOperation('mark');">
        <icon name="marker" />
      </button>
      <button
        v-if="$parent.$parent.blockType !== 'publii-list'"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        :disabled="!hasAnyStyling"
        @click.stop="$parent.doInlineOperation('clear');">
        <icon name="trash" />
      </button>
      <button
        v-if="$parent.$parent.blockType === 'publii-list'"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        :disabled="!$parent.selectedText.allowedOperations.indent"
        @click.stop="$parent.doInlineOperation('indent');">
        <icon name="nesting" />
      </button>
      <button
        v-if="$parent.$parent.blockType === 'publii-list'"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        :disabled="!$parent.selectedText.allowedOperations.outdent"
        @click.stop="$parent.doInlineOperation('outdent');">
        <icon name="flattening" />
      </button>
    </div>
  </div>
</template>

<script>
import EditorIcon from './../elements/EditorIcon.vue';

export default {
  name: 'inline-menu-ui',
  components: {
    'icon': EditorIcon
  },
  computed: {
    showInlineMenu () {
      return this.$parent.$parent.isSelected && this.$parent.textIsHighlighted && !this.$parent.$parent.uiOpened;
    },
    hasAnyStyling () {
      let tagsStatus = this.$parent.selectedText.containedTags;
      let tags = Object.keys(tagsStatus);

      for (let i = 0; i < tags.length; i++) {
        if (tagsStatus[tags[i]] === true) {
          return true;
        }
      }

      return false;
    }
  },
  watch: {
    showInlineMenu (newValue, oldValue) {
      if (!newValue) {
        this.$highlighter.removeAllHighlights();
      }
    }
  },
  data () {
    return {
      left: '',
      top: ''
    };
  },
  methods: {
    setPosition (left, top) {
      this.left = left;
      this.top = top;
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/variables.scss';
@import '../../assets/vue-multiselect.scss';

.is-highlighted {
  background: $block-editor-color-gradient-end;
}

.wrapper-ui-inline-menu {
  animation: inlineMenuIn .15s ease backwards;
  align-items: center;
  background: $block-editor-color-light;
  border: none;
  border-radius: 4px;
  box-shadow: 0 5px 10px -5px $block-editor-color-shadow, 4px -11px 26px -12px $block-editor-color-shadow, 0 24px 50px 2px $block-editor-color-shadow;
  left: 50%;
  margin-top: 16px;
  min-height: 43px;
  padding: 0 4px;
  position: absolute;
  top: 0%;
  transform: scale(1) translateX(-50%) translateY(64px);
  transform-origin: center left;
  width: auto;
  z-index: 10;

  @keyframes inlineMenuIn {
    0% {
        opacity: 0;
        transform: scale(.9) translateX(-50%) translateY(78px);
    }

    100% {
        opacity: 1;
    }
  }

  &::after {
    border: 9px solid $block-editor-color-light;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    height: 18px;
    left: 50%;
    position: absolute;
    top: -18px;
    transform: translateX(-50%);
    width: 18px;
    z-index: 1;
  }

  &-button {
    align-items: center;
    background: transparent;
    border: none;
    color: $block-editor-color-text-medium-dark;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    position: relative;
    width: 38px;

    &[disabled] {
      opacity: .3;
      pointer-events: none;
    }

    // hover effect
    &::before {
       content: "";
       background: $block-editor-color-light-dark;
       border-radius: 3px;
       display: block;
       left: 50%;
       opacity: 0;
       position: absolute;
       height: 34px;
       top: 50%;
       transition: all .15s cubic-bezier(.4,0,.2,1);
       transform: scale(.5) translate(-50%, -50%);
       transform-origin: left top;
       width: 34px;
       z-index: -1;
    }

    &:hover,
    &.is-active {
      color: $block-editor-color-text;

      &::before {
         opacity: 1;
         transform: scale(1) translate(-50%, -50%);
      }
    }
  }

  &-buttons {
    cursor: pointer;
    display: flex;
    height: 43px;
    width: 100%;
  }
}
</style>
