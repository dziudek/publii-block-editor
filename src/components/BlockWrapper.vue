<template>
  <div
    :class="{ 'wrapper': true, 'is-selected': isSelected }"
    @click.stop="$bus.$emit('block-editor-block-selected', id)">
    <slot />

    <div class="wrapper-ui-top">
      <div class="wrapper-add-above">+</div>
    </div>

    <div class="wrapper-ui-left">
      <div class="wrapper-move-up" @click="moveUp">⬆</div>
      <div class="wrapper-move-down" @click="moveDown">⬇</div>
    </div>

    <div class="wrapper-ui-right">
      <div class="wrapper-show-options">&hellip;</div>
    </div>

    <div class="wrapper-ui-bottom">
      <div class="wrapper-add-below">+</div>
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
    this.$bus.$on('block-editor-block-selected', this.blockSelection);
  },
  methods: {
    blockSelection (blockID) {
      this.isSelected = this.id === blockID;
    },
    moveUp () {
      this.$bus.$emit('block-editor-move-block-up', this.id);
    },
    moveDown () {
      this.$bus.$emit('block-editor-move-block-down', this.id);
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
    &-top,
    &-left,
    &-right,
    &-bottom {
      opacity: 0;
      position: absolute;

      & > div {
        background: #eee;
        border-radius: 50%;
        height: 24px;
        text-align: center;
        width: 24px;
      }
    }

    &-top {
      left: 50%;
      top: -20px;
      transform: translateX(-50%);
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

    &-bottom {
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
