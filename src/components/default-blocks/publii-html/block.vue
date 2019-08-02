<template>
  <div>
    <pre
      :class="{ 'publii-block-html': true, 'is-visible': view === 'code' }"
      ref="block"
      @paste="pastePlainText"
      @keydown="handleKeyboard"
      @keyup="handleCaret"
      @blur="save"
      contenteditable="true"
      v-html="content" />
    <div
      v-if="view === 'preview'"
      v-html="modifiedContent"
      @click="setView('code')"
      class="publii-block-html-preview">
    </div>
  </div>
</template>

<script>
import AdvancedConfig from './../../mixins/AdvancedConfig.vue';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import contentFilter from './content-filter.js';
import HasPreview from './../../mixins/HasPreview.vue';

export default {
  name: 'Html',
  mixins: [
    AdvancedConfig,
    Block,
    ContentEditableImprovements,
    HasPreview
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
  computed: {
    modifiedContent () {
      return contentFilter(this.content);
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

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    save () {
      this.content = this.$refs['block'].innerHTML;

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
.publii-block-html {
  background: #202020;
  border: 1px solid #111;
  border-radius: 3px;
  color: #ccc;
  display: none;
  font-size: 16px;
  line-height: 1.4;
  padding: 15px 20px;
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Enter HTML code';
      opacity: .35;
    }
  }

  &.is-visible {
    display: block;
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
