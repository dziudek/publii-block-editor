<template>
  <div
    @click.stop="hide()"
    :class="{ 'block-advanced-config-overlay': true, 'is-visible': isVisible }">
    <div
      @click.prevent.stop
      class="block-advanced-config"
      ref="form">
      <div
        v-for="(field, index) of configForm"
        :key="'field-' + index"
        class="block-advanced-config-field">
        <label
          :for="'advanced-config-field-' + index"
          :title="field.tooltip !== '' ? field.tooltip : ''">
          {{ field.label }}
          <span
            v-if="field.tooltip !== ''"
            class="block-advanced-config-field-help">?</span>
        </label>
        <input
          v-if="field.type === 'text'"
          :id="'advanced-config-field-' + index"
          type="text"
          v-model="config[field.name]" />
      </div>

      <div class="block-advanced-config-buttons">
        <button @click="save()">
          Save
        </button>
        <button @click="hide()">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'block-advanced-config',
  data () {
    return {
      isVisible: false,
      currentBlockID: '',
      config: {},
      configForm: []
    };
  },
  mounted () {
    this.$bus.$on('block-editor-show-advanced-config', this.show);
  },
  methods: {
    show (blockID, config, configForm) {
      this.isVisible = true;
      this.currentBlockID = blockID;
      this.config = JSON.parse(JSON.stringify(config));
      this.configForm = configForm;

      setTimeout(() => {
        this.$refs['form'].querySelector('.block-advanced-config-field').querySelector('input').focus();
      }, 100);
    },
    hide () {
      this.isVisible = false;

      setTimeout(() => {
        this.currentBlockID = '';
        this.config = {};
        this.configForm = [];
      }, 500);
    },
    save () {
      this.$bus.$emit('block-editor-save-advanced-config', this.currentBlockID, this.config);
      this.hide();
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-show-advanced-config', this.show);
  }
};
</script>

<style lang="scss">
@import '../assets/variables.scss';

.block-advanced-config {
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  border-radius: $block-editor-form-input-border-radius;
  padding: 20px;
  transform: translateY(30px);
  transition: all .3s ease-out;
  width: 580px;

  &-overlay {
    align-items: center;
    background: rgba(255, 255, 255, .9);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    transition: all .3s ease-out;
    width: 100%;
    z-index: 10000;

    &.is-visible {
      opacity: 1;
      pointer-events: auto;

      .block-advanced-config {
        transform: translateY(0);
      }
    }
  }

  &-field {
    margin: 0 0 10px 0;

    &-help {
      align-items: center;
      background: $block-editor-color-primary;
      border-radius: 50%;
      color: $block-editor-color-light;
      cursor: help;
      display: inline-flex;
      font-size: 10px;
      font-weight: bold;
      height: 14px;
      justify-content: center;
      position: relative;
      top: -1px;
      width: 14px;
    }

    label {
      color: $block-editor-color-text;
      display: block;
      font-size: 14px;
      padding-bottom: 5px;
    }

    input {
      border: 1px solid $block-editor-form-input-border;
      border-radius: $block-editor-form-input-border-radius;
      color: $block-editor-color-text;
      font-size: 16px;
      padding: 8px 12px;
      width: 100%;
    }
  }
}
</style>
