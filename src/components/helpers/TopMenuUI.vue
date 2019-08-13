<template>
  <div
    class="wrapper-ui-top-menu"
    v-if="$parent.$parent.uiOpened && !$parent.textIsHighlighted">
    <button
      v-for="(button, index) of filteredConfig"
      :key="'top-menu-button-' + index"
      :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': button.activeState.bind($parent)() }"
      tabindex="-1"
      @click.stop="button.onClick.bind($parent)()">
      <icon :name="button.icon" />
    </button>
  </div>
</template>

<script>
import EditorIcon from './../elements/EditorIcon.vue';

export default {
  name: 'top-menu-ui',
  props: [
    'config'
  ],
  components: {
    'icon': EditorIcon
  },
  computed: {
    filteredConfig () {
      return this.config.filter(button => typeof button.isVisible === 'undefined' || button.isVisible());
    }
  }
}
</script>
