<template>
  <div>
    <prism-editor
      :class="{ 'publii-block-html': true, 'is-visible': view === 'code' }"
      ref="block"
      @paste="pastePlainText"
      @keyup="handleKeyboard"
      @focus="updateCurrentBlockID"
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
import addAspectRatio from './aspect-ratio.js';
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
      let codeWithAspectRatio = addAspectRatio(this.$refs['block'].code);
      return contentFilter(codeWithAspectRatio);
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
  border-radius: var(--border-radius);
  background: var(--gray-8);
  box-shadow: 2px 4px 26px var(--shadow);
  outline: none;
  width: 100%;

  & > pre,
  & > .prism-editor__line-numbers {
    display: none;
  }

  &.is-visible {
    & > pre,
    & > .prism-editor__line-numbers {
      background: var(--gray-8) !important;
      display: block;
    }

    & > pre {
      background: var(--gray-8) !important;

      &:empty {
        &:before {
          content: 'Enter HTML code';
          color: var(--gray-4);
        }
      }
    }

    code {
      background: transparent !important;
      padding: 0!important;
    }
  }

  .prism-editor__line-numbers {
    background: var(--input-bg) !important;
  }

  &-preview {
    publii-script {
      background: var(--gray-1);
      border-left: 4px solid var(--secondary-color);
      border-radius: var(--border-radius);
      color: var(--gray-4);
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
        background: var(--gray-1);
        content: "JavaScript code is evaluated only in the preview.";
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

    .aspect-ratio-21-9,
    .aspect-ratio-18-9,
    .aspect-ratio-16-9,
    .aspect-ratio-4-3,
    .aspect-ratio-1-1,
    .aspect-ratio-9-6,
    .aspect-ratio-1-2 {
      position: relative;
      width: 100%;

      iframe {
        background: var(--gray-1);
        border: 1px solid var(--gray-2);
        border-radius: 5px;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }

    .aspect-ratio-21-9 {
      padding-bottom: 42.857143%;
    }

    .aspect-ratio-18-9 {
      padding-bottom: 50%;
    }

    .aspect-ratio-16-9 {
      padding-bottom: 56.25%;
    }

    .aspect-ratio-4-3 {
      padding-bottom: 75%;
    }

    .aspect-ratio-1-1 {
      padding-bottom: 100%;
    }

    .aspect-ratio-9-6 {
      padding-bottom: 66.666666%;
    }

    .aspect-ratio-1-2 {
      padding-bottom: 200%;
    }
  }
}
</style>
