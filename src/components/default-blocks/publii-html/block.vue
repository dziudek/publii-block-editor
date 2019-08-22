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
@import '../../../assets/variables.scss';

.publii-block-html {
  border-radius: 3px;
  color: #ccc;
  display: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 0;
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
      background: #1e2128 !important;

      &:empty {
        &:before {
          content: 'Enter HTML code';
          opacity: .35;
        }
      }
    }

    code {
      background: transparent !important;
      font-size: 15px!important;
      padding: 0!important;
    }
  }

  &-preview {
    padding: 15px 0;

    publii-script,
    publii-iframe {
      background: #f5f5f5;
      border: 1px solid #eee;
      color: #888;
      display: block;
      height: 48px;
      overflow: hidden;
      padding: 15px;
      position: relative;
      width: 100%;

      &:after {
        align-content: center;
        align-items: center;
        background: #f5f5f5;
        content: "This JavaScript code will be evaluated in the preview";
        display: flex;
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
        content: "This iframe will be loaded in the preview";
      }
    }
  }
}
</style>
