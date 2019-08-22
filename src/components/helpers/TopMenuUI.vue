<template>
  <div
    class="wrapper-ui-top-menu"
    v-if="$parent.$parent.uiOpened && !$parent.textIsHighlighted">
    <span
      v-if="!conversions.length"
      class="wrapper-ui-top-menu-title">
      Edit block
    </span>
    <span
      v-if="conversions.length"
      class="wrapper-ui-top-menu-title wrapper-ui-top-menu-conversions">
      Convert block:
      <span
        v-for="(conversion, index) of conversions"
        :key="'conversion-' + index"
        class="wrapper-ui-top-menu-conversion"
        @click="makeConversion(conversion.type, conversion.convert)">
        <icon :name="conversion.icon" />
        <!--<span class="wrapper-ui-top-menu-conversion-tooltip">
           Convert to {{ conversion.name }}
        </span>-->
      </span>
    </span>
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
  props: {
    'config': {
      type: Array,
      default: () => ([])
    },
    'conversions': {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    'icon': EditorIcon
  },
  computed: {
    filteredConfig () {
      return this.config.filter(button => typeof button.isVisible === 'undefined' || button.isVisible());
    }
  },
  methods: {
    makeConversion (outputType, convertCallback) {
      let transformedData = convertCallback(this.$parent.config, this.$parent.content, this.$parent.editor);
      this.$bus.$emit('block-editor-convert-block', this.$parent.id, outputType, transformedData);
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/variables.scss';
/*
.wrapper-ui-top-menu {
  background: $color-editor-color-light-medium;
  border-radius: $block-editor-form-input-border-radius;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .16);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 40px;
  left: 50%;
  padding: 5px 0;
  position: absolute;
  top: 30px;
  transform: translateX(-50%);
  width: 64px;
  z-index: 10;

  &.is-small {
    color: $block-editor-color-text;
    display: block;
    height: auto;
    padding: 5px 10px;
    width: auto;

    .publii-block-paragraph-block-selector-tooltip-label1 {
      height: auto;
    }
  }

  &:after {
    border: 6px solid $color-editor-color-light-medium;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .08));
    height: 12px;
    left: 50%;
    position: absolute;
    top: -12px;
    transform: translateX(-50%);
    width: 12px;
  }
}
*/
</style>
