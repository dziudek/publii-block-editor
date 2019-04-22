<template>
  <div :class="{ 'wrapper': true, 'is-selected': isSelected }">
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
  methods: {
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

}
</style>
