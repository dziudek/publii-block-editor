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
    <div
      @click.stop
      class="wrapper-ui-top-menu-options">
      <template v-for="(uiElement, index) of filteredConfig">
        <template v-if="!uiElement.type || uiElement.type === 'button'">
          <button
            :key="'top-menu-element-' + index"
            :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': uiElement.activeState.bind($parent)() }"
            tabindex="-1"
            @click="uiElement.onClick.bind($parent)(); resetDeleteConfirmation();">
            <icon :name="uiElement.icon" />
          </button>
        </template>
        <template v-else-if="uiElement.type === 'select'">
          <label :key="'top-menu-element-label-' + index">
            {{ uiElement.label }}
          </label>
          <vue-select
            :key="'top-menu-element-' + index"
            :options="uiElement.options"
            :clearable="uiElement.clearable"
            :searchable="uiElement.searchable"
            v-model="$parent.config[uiElement.configKey]" />
        </template>
      </template>
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
  </div>
</template>

<script>
import EditorIcon from './../elements/EditorIcon.vue';
import vSelect from 'vue-multiselect/dist/vue-multiselect.min.js';

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
    'icon': EditorIcon,
    'vue-select': vSelect
  },
  computed: {
    filteredConfig () {
      return this.config.filter(uiElement => typeof uiElement.isVisible === 'undefined' || uiElement.isVisible());
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

  &-options {
    align-items: center;
    display: flex;

    label {
      font-size: 15px;
      padding-right: 10px;
    }
  }

  .top-menu-button-trash {
    color: $block-editor-color-danger;
  }

  .multiselect {
    font-size: 13px;
    margin-left: auto;
    margin-right: 5px;
    position: relative;
    top: 4px;
    width: auto;

    &__tags {
      background: #3b3f48;
      border: none;
      height: 32px;
      min-height: 100%;
      padding: 6px 40px 6px 14px;
    }

    &__single {
      background: inherit;
      color: $block-editor-color-light-dark;
    }

    &__select {
      height: 28px;
      &::before {
          border-color: $block-editor-color-text-medium transparent transparent;
      }
    }

    &__content {
      margin-left: 0!important;
    }

    &__element {
      padding-left: 0!important;
    }

    &__content-wrapper {
      background: #30343c;
      border: none;
      color: $block-editor-color-light-dark;
    }

    &__option {
      padding: 7px 14px;
      min-height: 30px;

      &--highlight {
        background: $block-editor-color-primary;

        &:after {
          display: none;
        }
      }

      &.multiselect__option--selected {
        background: $block-editor-color-primary;
        color: $block-editor-color-light;

        &:after {
          display: none;
        }
      }
    }

    &__input {
      background: none !important;
      color: $block-editor-color-light;
      font-size: 13px;

      &::placeholder {
        color: $block-editor-color-light-dark;
      }
    }
  }
}
</style>
