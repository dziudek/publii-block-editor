<template>
  <div
    :class="{ 'wrapper': true, 'is-selected': isSelected }"
    @click.stop="$bus.$emit('block-editor-block-selected', id)">
    <slot />

    <div class="wrapper-ui-left">
      <div class="wrapper-move-up" @click.stop="moveUp">⬆</div>
      <div class="wrapper-move-down" @click.stop="moveDown">⬇</div>
    </div>

    <div class="wrapper-ui-right">
      <div class="wrapper-show-options">&hellip;</div>
      <div class="wrapper-delete" @click.stop="deleteBlock">&ndash;</div>
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
      isSelected: false
    };
  },
  mounted () {

  },
  methods: {
    setSelectionState (newState) {
      this.isSelected = newState;
    },
    moveUp () {
      this.$bus.$emit('block-editor-move-block-up', this.id);
    },
    moveDown () {
      this.$bus.$emit('block-editor-move-block-down', this.id);
    },
    deleteBlock () {
      this.$bus.$emit('block-editor-delete-block', this.id);
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  border: 1px solid transparent;
  margin: -1em 0;
  position: relative;

  &.is-selected {
    border: 1px solid #88d;

    .wrapper-ui {
      &-top,
      &-left,
      &-right,
      &-bottom {
        opacity: 1;
      }
    }
  }

  &:first-child {
    margin: 0 0 -1em 0;
  }

  &-ui {
    &-left,
    &-right {
      opacity: 0;
      position: absolute;
      z-index: 1;

      & > div {
        background: #eee;
        border-radius: 50%;
        height: 24px;
        text-align: center;
        width: 24px;
      }
    }

    &-left {
      left: -30px;
      top: 50%;
      transform: translateY(-50%);
    }

    &-right {
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
