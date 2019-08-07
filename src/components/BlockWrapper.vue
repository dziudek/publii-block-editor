<template>
  <div
    :data-block-type="blockType"
    ref="block-wrapper"
    :class="{ 'wrapper': true, 'is-selected': isSelected, 'has-ui-opened': uiOpened, [customCssClasses.join(' ')]: true }"
    @click.stop="blockClick"
    :style="'width: ' + ($parent.config.contentWidth + 40) + 'px;'">
    <slot />

    <div class="wrapper-ui">
      <div
        :class="{ 'wrapper-ui-show-options': true, 'is-confirming-delete': confirmDelete }"
        @click.stop="togglePopup">
        <icon
          :class="{ 'wrapper-ui-show-options-button': true, 'is-visible': isSelected && !uiOpened }"
          color="#5da4ef"
          name="dotted-line" />

          <div
            v-if="uiOpened"
            :class="{ 'wrapper-ui-options': true, 'is-visible': true }">
            <div
              v-if="confirmDelete"
              class="wrapper-ui-options-confirm-tooltip">
              Click to confirm
            </div>
            <button
              :class="{ 'wrapper-ui-options-button-trash': true }"
              tabindex="-1"
              @click.stop="deleteBlock">
              <icon name="trash" />
            </button>
            <button
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
  margin: -10px auto;
  opacity: .33;
  padding: 0 20px;
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

  &.has-ui-opened {
    border: 1px solid $block-editor-form-input-border;
    opacity: 1;

    &:after {
      background: $block-editor-color-primary;
      bottom: -1px;
      content: "";
      position: absolute;
      right: -1px;
      top: -40px;
      width: 3px;
      z-index: 10;
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
    right: -50px;
    top: -40px;
    z-index: 1;

    .wrapper-ui-show-options {
      height: 40px;
      transition: all .25s ease-out;
      width: 150px;

      &-button {
        opacity: 0;
        position: absolute;
        right: 15px;
        top: 38px;
        transform: scale(.5);
        transform-origin: center center;
        transition: transform .25s ease-out;

        &.is-visible {
          opacity: 1;
          transform: scale(1.2);
        }
      }

      &.is-confirming-delete {
        .wrapper-ui-options-button-trash {
          color: $block-editor-color-danger;
        }
      }
    }

    &-options {
      background: $block-editor-color-light;
      border: 1px solid $block-editor-form-input-border;
      height: 40px;
      position: absolute;
      right: 50px;
      top: 0;
      width: 86px;

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
        height: 27px;
        justify-content: center;
        margin: 5px;
        outline: none;
        padding: 0;
        position: absolute;
        width: 28px;

        &:hover,
        &.is-active {
          background: $block-editor-color-light-dark;
          color: $block-editor-color-text;
        }
      }

      &-button-trash.is-active{
        color: $block-editor-color-danger;
      }

      &-button-more-options {
        left: 5px;
      }

      &-button-trash {
        right: 5px;
        top: 0;
      }

      &-button-move {
        right: -40px;
        top: -12px;
      }

      &-button-move + .wrapper-ui-options-button-move {
        top: 12px;
      }

      &-confirm-tooltip {
        background: $block-editor-color-danger;
        border-radius: $block-editor-form-input-border-radius;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .16);
        color: $block-editor-color-light;
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        justify-content: center;
        height: auto;
        right: 24px;
        padding: 5px;
        position: absolute;
        top: -30px;
        transform: translateX(50%);
        white-space: nowrap;
        width: auto;
        z-index: 10;

        &:after {
          bottom: -12px;
          border: 6px solid $block-editor-color-danger;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          content: "";
          filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .08));
          height: 12px;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 12px;
        }
      }
    }

    &-top-menu {
      align-items: center;
      background: $block-editor-color-light;
      border: none;
      display: flex;
      height: 40px;
      border: 1px solid $block-editor-form-input-border;
      border-right: none;
      padding: 0 0 0 5px;
      position: absolute;
      top: -40px;
      right: 80px;
      z-index: 10;

      &-button {
        align-items: center;
        background: $block-editor-color-light;
        border: none;
        border-radius: 2px;
        color: $block-editor-color-text-medium-dark;
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
  }
}

.editor[data-ui-opened-block=""] {
  .wrapper {
    opacity: 1;
  }
}
</style>
