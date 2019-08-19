<template>
  <div
    :data-block-type="blockType"
    ref="block-wrapper"
    :class="{ 'wrapper': true, 'is-selected': isSelected, 'has-ui-opened': uiOpened, [customCssClasses.join(' ')]: true }"
    @click.stop="blockClick"
    :style="'width: ' + ($parent.config.contentWidth + 64) + 'px;'">
    <slot />

    <div class="wrapper-ui">
      <div
        :class="{ 'wrapper-ui-show-options': true, 'is-confirming-delete': confirmDelete }"
        @click.stop="togglePopup">
          <button
            :class="{ 'wrapper-ui-show-options-button': true, 'is-visible': isSelected && !uiOpened }">
            <icon
              color="#5da4ef"
              name="dotted-line" />
          </button>

          <div
            v-if="uiOpened"
            :class="{ 'wrapper-ui-options': true, 'is-visible': true, 'is-narrow': blockType === 'publii-readmore' }">
            <button
              :class="{ 'wrapper-ui-options-button-trash': true }"
              tabindex="-1"
              @click.stop="deleteBlock">
              <icon name="trash" />
            </button>
              <button
              v-if="confirmDelete"
              :class="{ 'wrapper-ui-options-button-trash': true }"
              tabindex="-1"
              @click.stop="deleteBlock">
              <icon name="open-trash" />
            </button>
            <button
              v-if="blockType !== 'publii-readmore'"
              :class="{ 'wrapper-ui-options-button-more-options': true }"
              tabindex="-1"
              @click.stop="showAdvancedConfig">
              <icon name="gear" />
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
  watch: {
    uiOpened (newState, oldState) {
      if (newState) {
        this.$bus.$emit('block-editor-ui-opened-for-block', this.id);
      } else {
        this.$bus.$emit('block-editor-ui-closed-for-block', this.id);
      }
    }
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

      if (this.uiOpened) {
        this.$bus.$emit('block-editor-clear-text-selection', this.id);
      }

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
      let startBlockTop = this.$refs['block-wrapper'].getBoundingClientRect().top;
      this.$bus.$emit('block-editor-move-block-up', this.id, startBlockTop);
    },
    moveDown () {
      let startBlockTop = this.$refs['block-wrapper'].getBoundingClientRect().top;
      this.$bus.$emit('block-editor-move-block-down', this.id, startBlockTop);
    },
    deleteBlock () {
      if (!this.confirmDelete) {
        this.confirmDelete = true;
      } else {
        this.$bus.$emit('block-editor-delete-block', this.id);
      }
    },
    showAdvancedConfig () {
      this.$bus.$emit('block-editor-trigger-advanced-config', this.id);
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
  border: 1px solid transparent;
  margin: 0 auto;
  opacity: .33;
  padding: 0 32px;
  position: relative;
  transition: width .25s ease-out, opacity .35s ease-out;
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

  & > div {
    padding: 1rem 0;
  }

  &.has-ui-opened {
    background: $block-editor-color-light;
    border-radius: 6px;
    box-shadow: 0 0 32px $block-editor-color-shadow;
    margin-top: -44px;
    opacity: 1;
    z-index: 2;

    &::after {
      background: $block-editor-color-primary;
      bottom: -1px;
      content: "";
      position: absolute;
      right: -1px;
      top: -1px;
      width: 3px;
      z-index: 10;
    }

    & > div {
      display: flex;
      flex-direction: column-reverse;
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
  }

  &-ui {
    opacity: 0;
    position: absolute;
    pointer-events: none;
    right: -50px;
    top: -41px;
    z-index: 1;

    .wrapper-ui-show-options {
      height: 44px;
      transition: all .25s ease-out;
      width: 150px;

      &-button {
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0;
        padding: 16px;
        position: absolute;
        right: 0px;
        top: 14px;
        transform: scale(.5);
        transform-origin: center center;
        transition: transform .25s ease-out;

        &:focus {
          outline: none;
        }

        &::after {
          content:"";
          border: 2px solid rgba($block-editor-color-primary, .4);
          border-radius: 50%;
          height: 50px;
          left: 50%;
          opacity: 0;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 50px;

          @keyframes focusOut {
            0% {
                opacity: 0;
            }
            25% {
                 opacity: 1;
            }
          }
        }

        & > svg {
          vertical-align: middle;
        }

        &.is-visible {
          opacity: 1;
          transform: scale(1.2);

          &:hover {
            transform: scale(1.4);
          }

          &::after {
            animation: focusOut .75s ease-out backwards;
          }
        }
      }

      &.is-confirming-delete {
        .wrapper-ui-options-button-trash {
          color: $block-editor-color-light;

          &::before {
             background: $block-editor-color-danger;
             opacity: 1;
             transform: scale(1) translate(-50%, -50%);
          }
        }
      }
    }

    &-options {
      height: 44px;
      position: absolute;
      right: 64px;
      top: 47px;
      width: 86px;

      &.is-narrow {
        width: 48px;
      }

      &.is-visible {
        opacity: 1;
        pointer-events: auto;
      }

      &-row {
        display: flex;
      }

      &-button-move,
      &-button-more-options,
      &-button-trash {
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
        position: absolute;
        top: 0;
        width: 38px;
        z-index: 0;

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

      &-button-trash.is-active{
        color: $block-editor-color-danger;
      }

      &-button-more-options {
        left: 4px;
      }

      &-button-trash {
        right: 7px;
      }

      &-button-move {
        right: -60px;
        top: -2px;
      }

      &-button-move + .wrapper-ui-options-button-move {
        top: 32px;
      }
    }

    &-top-menu {
      align-items: center;
      border: none;
      display: flex;
      height: 44px;
      justify-content: flex-end;
      margin: -9px 64px 9px 0;

      &-title {
          color: $block-editor-color-text-medium;
          display: block;
          font-size: 11px;
          font-weight: 700;
          margin: 3px auto 0 0;
          text-transform: uppercase;
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
    }
  }
}

.editor[data-ui-opened-block=""] {
  .wrapper {
    opacity: 1;
  }
}
</style>
