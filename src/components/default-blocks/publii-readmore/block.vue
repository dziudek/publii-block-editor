<template>
  <div>
    <div
      class="publii-block-readmore"
      contenteditable="true"
      @keyup="getFocusFromTab($event); handleCaret($event)"
      @paste="pastePlainText"
      ref="block">
      <hr />
    </div>

    <top-menu
      ref="top-menu"
      :config="[]" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'ReadMore',
  mixins: [
    Block
  ],
  components: {
    'top-menu': TopMenuUI
  },
  data () {
    return {
      config: {
        advanced: {}
      },
      content: ''
    };
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.$refs['block'].addEventListener('keydown', this.handleKeyboard);
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter') {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
      }

      if (e.code === 'Backspace') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (e.code !== 'Tab') {
        e.returnValue = false;
      }
    },
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleKeyboard);
  }
}
</script>

<style lang="scss">
@import '../../../vendors/modularscale';
@import '../../../assets/functions.scss';
@import '../../../assets/variables.scss';
@import '../../../assets/mixins.scss';

.publii-block-readmore {
  caret-color: transparent;
  margin: baseline(7) 0;
  outline: none;
  position: relative;
  width: 100%;

  hr {
    background-color: currentColor;
    height: 1px;
    border: 0;
  }

  &:after {
    background: $block-editor-color-light;
    border: 1px solid;
    border-radius: $block-editor-form-input-border-radius;
    content: "Read More";
    display: inline-block;
    font-size: ms(-3);
    left: 50%;
    padding: 6px 16px;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
