<template>
  <div
    :data-block-type="blockType"
    :class="{ 'wrapper': true, 'is-selected': isSelected, [customCssClasses.join(' ')]: true }"
    @click.stop="blockClick"
    :style="'width: ' + $parent.config.contentWidth + 'px;'">
    <slot />

    <div class="wrapper-ui">
      <div :class="{ 'wrapper-ui-show-options': true, 'is-confirming-delete': confirmDelete }" @click.stop="togglePopup">
        <icon
          v-if="!uiOpened"
          name="gear" />

          <div
            v-if="uiOpened"
            :class="{ 'wrapper-ui-options': true, 'is-visible': true }">
            <button
              :class="{ 'wrapper-ui-options-button-trash': true }"
              tabindex="-1"
              @click.stop="deleteBlock">
              <icon name="trash" />
            </button>
            <button
              class="wrapper-ui-options-button-move"
              tabindex="-1"
              @click.stop="moveUp">
              <icon name="up" />
            </button>
            <button
              class="wrapper-ui-options-button-move"
              tabindex="-1"
              @click.stop="moveDown">
              <icon name="down" />
            </button>
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
      customCssClasses: [],
      isSelected: false,
      uiOpened: false,
      confirmDelete: false
    };
  },
  mounted () {
    this.$bus.$on('block-editor-deselect-blocks', this.deselectBlock);
  },
  methods: {
    blockClick () {
      this.$bus.$emit('block-editor-deselect-blocks', this.id);
      this.uiOpened = false;
      this.confirmDelete = false;
      this.setSelectionState(true);
    },
    deselectBlock (blockID) {
      if (blockID !== this.id) {
        this.setSelectionState(false);
      }
    },
    togglePopup () {
      this.uiOpened = !this.uiOpened;

      if (!this.uiOpened) {
        this.confirmDelete = false;
      }
    },
    setSelectionState (newState) {
      if (this.isSelected && newState === false) {
        this.$bus.$emit('block-editor-trigger-block-save', this.id);
      }

      this.isSelected = newState;

      if (!this.isSelected) {
        this.uiOpened = false;
        this.confirmDelete = false;
      }

      if (newState) {
        this.$bus.$emit('block-editor-block-selected', this.id);
      }
    },
    addCustomCssClass (cssClass) {
      if (this.customCssClasses.indexOf(cssClass) === -1) {
        this.customCssClasses.push(cssClass);
      }
    },
    removeCustomCssClass (cssClass) {
      if (this.customCssClasses.indexOf(cssClass) > -1) {
        this.customCssClasses = this.customCssClasses.filter(item => item !== cssClass);
      }
    },
    moveUp () {
      this.$bus.$emit('block-editor-move-block-up', this.id);
    },
    moveDown () {
      this.$bus.$emit('block-editor-move-block-down', this.id);
    },
    deleteBlock () {
      if (!this.confirmDelete) {
        this.confirmDelete = true;
      } else {
        this.$bus.$emit('block-editor-delete-block', this.id);
      }
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
  margin: -10px auto;
  position: relative;
  transition: width .25s ease-out;
  z-index: 1;

  &[data-block-type="publii-embed"] {
    margin: 15px auto;
  }

  &.is-selected {
    z-index: 10;

    .wrapper-ui {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.has-block-selector-visible {
    z-index: 10;
  }

  &.contains-full-image {
    width: calc(100% - 80px)!important;

    .publii-block-image-form input {
      margin-left: auto;
      margin-right: auto;
      max-width: 720px;
    }

    .wrapper-ui {
      right: 0;
    }
  }

  &:first-child {
    margin: 0 auto -10px auto;
  }

  &-ui {
    opacity: 0;
    position: absolute;
    pointer-events: none;
    right: -84px;
    top: -10px;
    z-index: 1;

    .wrapper-ui-show-options {
      background-image: linear-gradient(to right top, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, .05));
      background-size: auto;
      background-repeat: no-repeat;
      background-position: right top;
      border-radius: 0 8px 0 0;
      color: $block-editor-color-shadow;
      height: 80px;
      transition: all .25s ease-out;
      width: 150px;

      & > svg {
        position: absolute;
        right: 15px;
        top: 12px;
      }

      &.is-confirming-delete {
        background-image: linear-gradient(to right top, rgba(255, 255, 255, 0) 50%, rgba(255, 0, 0, .125));
      }
    }

    &-options {
      position: absolute;
      right: 4px;
      top: 5px;

      &.is-visible {
        opacity: 1;
        pointer-events: auto;
      }

      &-row {
        display: flex;
      }

      &-button-move,
      &-button-trash {
        align-items: center;
        background: transparent;
        border: none;
        color: $block-editor-color-text-medium-dark;
        cursor: pointer;
        display: flex;
        height: 27px;
        justify-content: center;
        margin: 0 5px;
        outline: none;
        padding: 0;
        position: absolute;
        width: 28px;

        &:hover,
        &.is-active {
          color: $block-editor-color-text;
        }
      }

      &-button-trash,
      &-button-danger,
      &-button-trash:hover,
      &-button-trash.is-active{
        color: $block-editor-color-danger;
      }

      &-button-trash {
        right: -2px;
        top: 0;
      }

      &-button-move + .wrapper-ui-options-button-move {
        top: 20px;
      }
    }

    &-top-menu {
      align-items: center;
      background: $block-editor-color-primary;
      border: none;
      border-radius: 4px;
      box-shadow: 0 1px 6px $block-editor-color-shadow;
      display: flex;
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

        &:hover,
        &.is-active {
          background: $block-editor-color-primary-dark;
        }
      }
    }
  }
}
</style>
