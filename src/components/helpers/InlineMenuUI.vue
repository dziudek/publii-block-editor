<template>
  <transition name="block-editor-ui-fade">
    <div
      v-if="showInlineMenu"
      class="wrapper-ui-inline-menu"
      :style="'left: ' + left + '; top: ' + top + ';'"
      :key="'inline-menu-' + $parent.id">
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.bold }"
        @click.stop="$parent.doInlineOperation('strong');">
        <icon name="bold" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.italic }"
        @click.stop="$parent.doInlineOperation('em');">
        <icon name="italic" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.underline }"
        @click.stop="$parent.doInlineOperation('u');">
        <icon name="underline" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.strikethrough }"
        @click.stop="$parent.doInlineOperation('s');">
        <icon name="strikethrough" />
      </button>
      <button
        v-if="!$parent.selectedTextContains.link"
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.linkUI.visible }"
        @click.stop="$parent.showLinkUI();">
        <icon name="link" />
      </button>
      <button
        v-if="$parent.selectedTextContains.link"
        :class="{ 'wrapper-ui-inline-menu-button': true }"
        @click.stop="$parent.doInlineOperation('unlink');">
        <icon name="unlink" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.code }"
        @click.stop="$parent.doInlineOperation('code');">
        <icon name="code" />
      </button>
      <button
        :class="{ 'wrapper-ui-inline-menu-button': true, 'is-active': $parent.selectedTextContains.mark }"
        @click.stop="$parent.doInlineOperation('mark');">
        <icon name="marker" />
      </button>

      <div
        v-if="$parent.linkUI.visible || $parent.selectedTextContains.link"
        class="wrapper-ui-inline-menu-link">
        <input
          type="text"
          class="wrapper-ui-inline-menu-link-input"
          v-model="$parent.linkUI.url"
          @keyup.enter="$parent.doInlineOperation('link')" />
      </div>
    </div>
  </transition>
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

.is-highlighted {
  background: $block-editor-color-gradient-end;
}

.wrapper-ui-inline-menu {
  align-items: center;
  background: $block-editor-color-light;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 6px $block-editor-color-shadow;
  display: flex;
  height: 43px;
  left: 50%;
  padding: 0 13px;
  position: absolute;
  top: 0%;
  transform: translateX(-50%) translateY(64px);
  z-index: 1;

  &:after {
    border: 6px solid $block-editor-color-light;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .125));
    height: 12px;
    left: 50%;
    position: absolute;
    top: -12px;
    transform: translateX(-50%);
    width: 12px;
    z-index: 1;
  }

  &-button {
    align-items: center;
    background: $block-editor-color-light;
    border: none;
    border-radius: 2px;
    color: $block-editor-color-text;
    cursor: pointer;
    display: flex;
    height: 27px;
    justify-content: center;
    margin: 0 5px;
    outline: none;
    padding: 0;
    width: 28px;

    &:hover,
    &.is-active {
      background: $block-editor-color-light-dark;
    }
  }
}
</style>
