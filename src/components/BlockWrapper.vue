<template>
  <div
    :data-block-type="blockType"
    :class="{ 'wrapper': true, 'is-selected': isSelected }"
    @click.stop="blockClick">
    <slot />

    <div class="wrapper-ui">
      <div class="wrapper-ui-show-options" @click.stop="togglePopup">
        <icon
          name="menu"
          width="18"
          height="4" />
      </div>

      <div :class="{ 'wrapper-ui-popup': true, 'is-visible': popupOpened }">
        <div class="wrapper-ui-popup-row">
          <button
            class="wrapper-ui-popup-button"
            tabindex="-1"
            @click.stop="moveUp">🔼</button>
          <button
            class="wrapper-ui-popup-button"
            tabindex="-1"
            @click.stop="deleteBlock">🗑</button>
          <button
            class="wrapper-ui-popup-button"
            tabindex="-1"
            @click.stop="moveDown">🔽</button>
        </div>

        <div class="wrapper-ui-popup-row">
          <button
            class="wrapper-ui-popup-button"
            tabindex="-1"
            @click.stop="addBlock">↩️</button>
          <button
            class="wrapper-ui-popup-button"
            tabindex="-1"
            @click.stop="showMore">⚙️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/elements/EditorIcon.vue';

export default {
  name: 'BlockWrapper',
  props: [
    'id',
    'blockType'
  ],
  components: {
    'icon': Icon
  },
  data () {
    return {
      isSelected: false,
      popupOpened: false
    };
  },
  mounted () {
    this.$bus.$on('block-editor-deselect-blocks', this.deselectBlock);
  },
  methods: {
    blockClick () {
      this.$bus.$emit('block-editor-deselect-blocks', this.id);
      this.popupOpened = false;
      this.setSelectionState(true);
    },
    deselectBlock (blockID) {
      if (blockID !== this.id) {
        this.setSelectionState(false);
      }
    },
    togglePopup () {
      this.popupOpened = !this.popupOpened;
    },
    setSelectionState (newState) {
      if (this.isSelected && newState === false) {
        this.$bus.$emit('block-editor-trigger-block-save', this.id);
      }

      this.isSelected = newState;

      if (!this.isSelected) {
        this.popupOpened = false;
      }

      if (newState) {
        this.$bus.$emit('block-editor-block-selected', this.id);
      }
    },
    moveUp () {
      this.$bus.$emit('block-editor-move-block-up', this.id);
    },
    moveDown () {
      this.$bus.$emit('block-editor-move-block-down', this.id);
    },
    addBlock () {
      this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
    },
    deleteBlock () {
      this.$bus.$emit('block-editor-delete-block', this.id);
    },
    showMore () {

    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-deselect-blocks', this.deselectBlock);
  }
}
</script>

<style lang="scss">
@import '../assets/variables.scss';

.wrapper {
  border: 2px solid transparent;
  margin: -10px 0;
  position: relative;

  &[data-block-type="publii-embed"] {
    margin: 15px 0;
  }

  &.is-selected {
    .wrapper-ui {
      opacity: 1;
    }
  }

  &:first-child {
    margin: 0 0 -10px 0;
  }

  &-ui {
    opacity: 0;
    position: absolute;
    right: -84px;
    top: -5px;
    z-index: 1;

    .wrapper-ui-show-options {
      background-image: linear-gradient(to right top, rgba(255, 255, 255, 0) 50%, $block-editor-color-gradient-end);
      background-size: auto;
      background-repeat: no-repeat;
      background-position: right top;
      border-radius: 0 8px 0 0;
      color: $block-editor-color-primary;
      height: 80px;
      width: 150px;

      & > svg {
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }

    &-popup {
      background: #fff;
      border: 1px solid #aaa;
      border-radius: 5px;
      display: flex;
      flex-wrap: wrap;
      left: 50%;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      top: 110%;
      transform: translateX(-50%);
      width: auto;

      &.is-visible {
        opacity: 1;
        pointer-events: auto;
      }

      &-row {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      &-button {
        align-items: center;
        border: none;
        display: flex;
        height: 32px;
        justify-content: center;
        outline: none;
        width: 32px;
      }
    }

    &-top-menu {
      align-items: center;
      background: $block-editor-color-primary;
      border: none;
      border-radius: 4px;
      box-shadow: 0 1px 6px $block-editor-color-shadow;
      display: flex;
      flex-wrap: wrap;
      height: 43px;
      left: 50%;
      padding: 0 13px;
      position: absolute;
      top: 0%;
      transform: translateX(-50%) translateY(-32px);

      &:after {
        border: 6px solid $block-editor-color-primary;
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        bottom: -12px;
        content: "";
        height: 12px;
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
        width: 12px;
      }

      &-button {
        align-items: center;
        background: $block-editor-color-primary;
        border: none;
        border-radius: 2px;
        color: $block-editor-color-light;
        cursor: pointer;
        display: flex;
        height: 27px;
        justify-content: center;
        margin: 0 5px;
        outline: none;
        padding: 0;
        width: 28px;

        &.is-active {
          background: $block-editor-color-primary-dark;
        }
      }
    }
  }
}
</style>
