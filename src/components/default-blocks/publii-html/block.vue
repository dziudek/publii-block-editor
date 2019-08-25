<template>
  <div>
    <prism-editor
      :class="{ 'publii-block-html': true, 'is-visible': view === 'code' }"
      ref="block"
      @paste="pastePlainText"
      @keyup="handleKeyboard"
      :code="content"
      :emitEvents="true"
      v-model="content"
      :lineNumbers="true"
      language="html">
    </prism-editor>

    <div
      v-if="view === 'preview'"
      v-html="modifiedContent"
      @click="setView('code')"
      class="publii-block-html-preview">
    </div>

    <top-menu
      ref="top-menu"
      :conversions="conversions"
      :config="[]" />
  </div>
</template>

<script>
import AvailableConversions from './conversions.js';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import contentFilter from './content-filter.js';
import HasPreview from './../../mixins/HasPreview.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'Html',
  mixins: [
    Block,
    ContentEditableImprovements,
    HasPreview
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
      content: '',
      conversions: AvailableConversions
    };
  },
  computed: {
    modifiedContent () {
      return contentFilter(this.$refs['block'].code);
    }
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content = this.inputContent;
    this.view = this.content === '' ? 'code' : 'preview';
  },
  methods: {
    focus () {
      this.$refs['block'].$el.querySelector('pre').focus();
    },
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === true) {
        e.preventDefault();
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // eslint-disable-next-line
        document.execCommand('insertHTML', false, "  ");
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].$el.querySelector('pre').innerHTML === '') {
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
@import '../../../vendors/modularscale';
@import '../../../assets/functions.scss';
@import '../../../assets/variables.scss';
@import '../../../assets/mixins.scss';

.publii-block-html {
  border-radius: $block-editor-form-input-border-radius;
  background: $block-editor-color-code-bg;
  box-shadow: 2px 4px 26px $block-editor-color-shadow;
  outline: none;
  width: 100%;

  & > pre,
  & > .prism-editor__line-numbers {
    display: none;
  }

  &.is-visible {
    & > pre,
    & > .prism-editor__line-numbers {
      display: block;
    }

    & > pre {
      background: $block-editor-color-code-bg !important;

      &:empty {
        &:before {
          content: 'Enter HTML code';
          opacity: .35;
        }
      }
    }

    code {
      background: transparent !important;
      padding: 0!important;
    }
  }

  .prism-editor__line-numbers {
    background: $block-editor-color-code-bg !important;
  }

  &-preview {

    publii-script,
    publii-iframe {
      background: $color-editor-color-light-medium;
      border-left: 4px solid $block-editor-color-primary-dark;
      border-radius: $block-editor-form-input-border-radius;
      color: $block-editor-color-text-medium;
      display: block;
      height: baseline(12);
      margin-bottom: baseline(2);
      overflow: hidden;
      padding: baseline(4);
      position: relative;
      width: 100%;

      &:after {
        align-content: center;
        align-items: center;
        background: $color-editor-color-light-medium;
        content: "JavaScript code is evaluated only in edit mode.";
        display: flex;
        font-size: ms(-1);
        height: 100%;
        justify-content: center;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }

    publii-iframe {
      &:after {
        content: "The iframe is loaded only in edit mode.";
      }
    }
  }
}
</style>
