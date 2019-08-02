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
  </div>
</template>

<script>
import AdvancedConfig from './../../mixins/AdvancedConfig.vue';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';

export default {
  name: 'ReadMore',
  mixins: [
    AdvancedConfig,
    Block
  ],
  data () {
    return {
      config: {
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
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
.publii-block-readmore {
  caret-color: transparent;
  margin: 32px 0;
  outline: none;
  position: relative;
  width: 100%;

  &:after {
    background: #fff;
    content: "Read More";
    display: inline-block;
    font-size: 12px;
    left: 50%;
    padding: 0 10px;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
