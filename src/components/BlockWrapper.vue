<template>
  <div
    :class="{ 'wrapper': true, 'is-selected': isSelected }"
    @click.stop="$bus.$emit('block-editor-block-selected', id); popupOpened = false;">
    <slot />

    <div class="wrapper-ui">
      <div class="wrapper-ui-show-options" @click.stop="togglePopup">&hellip;</div>

      <div :class="{ 'wrapper-ui-popup': true, 'is-visible': popupOpened }">
        <div class="wrapper-ui-popup-row">
          <div class="wrapper-ui-popup-button" @click.stop="moveUp">🔼</div>
          <div class="wrapper-ui-popup-button" @click.stop="deleteBlock">🗑</div>
          <div class="wrapper-ui-popup-button" @click.stop="moveDown">🔽</div>
        </div>

        <div class="wrapper-ui-popup-row">
          <div class="wrapper-ui-popup-button" @click.stop="addBlock">↩️</div>
          <div class="wrapper-ui-popup-button" @click.stop="showMore">⚙️</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockWrapper',
  props: [
    'id'
  ],
  data () {
    return {
      isSelected: false,
      popupOpened: false
    };
  },
  mounted () {

  },
  methods: {
    togglePopup () {
      this.popupOpened = !this.popupOpened;
    },
    setSelectionState (newState) {
      this.isSelected = newState;

      if (!this.isSelected) {
        this.popupOpened = false;
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
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  border: 2px solid transparent;
  margin: -10px 0;
  position: relative;

  &.is-selected {
    border: 2px solid rgba(100, 100, 250, .25);

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
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    .wrapper-ui-show-options {
      background: #eee;
      border-radius: 50%;
      height: 24px;
      text-align: center;
      width: 24px;
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
        display: flex;
        height: 32px;
        justify-content: center;
        width: 32px;
      }
    }
  }
}
</style>
