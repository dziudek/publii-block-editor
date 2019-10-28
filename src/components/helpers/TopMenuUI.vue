<template>
  <div
    class="wrapper-ui-top-menu"
    v-if="isVisible"
    @click="resetDeleteConfirmation">
    <span
      v-if="!conversions.length"
      class="wrapper-ui-top-menu-title">
      Edit block
    </span>
    <span
      v-if="conversions.length"
      class="wrapper-ui-top-menu-title wrapper-ui-top-menu-conversions">
      Convert to:
      <span
        v-for="(conversion, index) of conversions"
        :key="'conversion-' + index"
        class="wrapper-ui-top-menu-conversion"
        @click="makeConversion(conversion.type, conversion.convert); resetDeleteConfirmation();">
        <icon :name="conversion.icon" />
        <span class="wrapper-ui-top-menu-conversion-tooltip">
          {{ conversion.name }}
        </span>
      </span>
    </span>
    <button
      v-for="(button, index) of filteredConfig"
      :key="'top-menu-button-' + index"
      :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': button.activeState.bind($parent)() }"
      tabindex="-1"
      @click.stop="button.onClick.bind($parent)(); resetDeleteConfirmation();">
      <icon :name="button.icon" />
    </button>
    <button
      v-if="$parent.$parent.blockType !== 'publii-readmore'"
      :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': $parent.config.advanced.cssClasses !== '' || $parent.config.advanced.id !== '' }"
      tabindex="-1"
      @click.stop="showAdvancedConfig(); resetDeleteConfirmation();">
      <icon name="gear" />
    </button>
    <button
      v-if="!confirmDelete"
      class="wrapper-ui-top-menu-button"
      tabindex="-1"
      @click.stop="deleteBlock">
      <icon name="trash" />
    </button>
    <button
      v-if="confirmDelete"
      class="wrapper-ui-top-menu-button top-menu-button-trash is-active"
      tabindex="-1"
      @click.stop="deleteBlock">
      <icon name="open-trash" />
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
    },
    isVisible () {
      return this.$parent.$parent.uiOpened && !this.$parent.textIsHighlighted;
    }
  },
  watch: {
    isVisible (newValue) {
      if (newValue) {
        this.confirmDelete = false;
      }
    }
  },
  data () {
    return {
      confirmDelete: false
    };
  },
  methods: {
    makeConversion (outputType, convertCallback) {
      let transformedData = convertCallback(this.$parent.config, this.$parent.content, this.$parent.editor, this.$parent.$refs['block']);
      this.$bus.$emit('block-editor-convert-block', this.$parent.id, outputType, transformedData);
    },
    deleteBlock () {
      if (!this.confirmDelete) {
        this.confirmDelete = true;
      } else {
        this.$bus.$emit('block-editor-delete-block', this.$parent.id);
      }
    },
    showAdvancedConfig () {
      this.$bus.$emit('block-editor-trigger-advanced-config', this.$parent.id);
    },
    resetDeleteConfirmation () {
      this.confirmDelete = false;
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/variables.scss';

.wrapper-ui-top-menu {
  &-conversions {
    align-items: center;
    display: flex;
  }

  &-conversion {
    display: inline-flex;
    justify-content: center;
    padding: 0;
    position: relative;
    width: 38px;

    & > svg {
        fill: $block-editor-color-text-medium-dark !important;
    }

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

    &-tooltip {
      background: $color-editor-color-light-medium;
      border-radius: $block-editor-form-input-border-radius;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .16);
      color: $block-editor-color-text;
      display: flex;
      flex-wrap: wrap;
      font-size: 13px;
      font-weight: normal;
      justify-content: center;
      height: auto;
      opacity: 0;
      padding: 5px 8px;
      pointer-events: none;
      position: absolute;
      text-transform: none;
      top: 34px;
      min-width: 64px;
      z-index: 10;

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

    &:hover {
      cursor: pointer;

      .wrapper-ui-top-menu-conversion-tooltip {
        animation: fadeIn .75s forwards;
        opacity: 1;
        transform: scale(1) translateX(-50%);
      }

      @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: scale(.5) translateX(-50%);
        }

        50% {
            opacity: 1;
            transform: scale(1.05) translateX(-50%);
        }

        70% {
            transform: scale(.9) translateX(-50%);
        }

        100% {
            transform: scale(1) translateX(-50%);
        }
      }

      &::before {
         opacity: 1;
         transform: scale(1) translate(-50%, -50%);
      }

      & > svg {
         fill: $block-editor-color-text !important;
      }
    }
  }

  .top-menu-button-trash {
    color: $block-editor-color-danger;
  }
}
</style>
