<template>
  <div>
    <prism-editor
      :class="{ 'publii-block-code': true }"
      ref="block"
      @paste="pastePlainText"
      @keyup="handleKeyboard"
      :code="content"
      :emitEvents="true"
      v-model="content"
      language="js">
    </prism-editor>

    <top-menu
      ref="top-menu"
      :config="[]" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'Code',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'top-menu': TopMenuUI
  },
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
    this.content = this.inputContent;
  },
  methods: {
    focus () {
      this.$refs['block'].$el.querySelector('pre').focus();
    },
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === true) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].code === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    save () {
      this.content = this.$refs['block'].code;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/variables.scss';

.publii-block-code {
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Enter code';
      opacity: .35;
    }
  }

  & > .prism-editor__line-numbers {
    display: none;
  }

  & > pre {
    background: #1e2128 !important;
    border: 1px solid $block-editor-form-input-border;
    display: block;

    &:empty {
      &:before {
        content: 'Enter HTML code';
        opacity: .35;
      }
    }

    code {
      background: transparent !important;
      font-size: 15px!important;
      padding: 0!important;
    }
  }
}
</style>
