<template>
  <div>
    <component
      :is="config.listType"
      contenteditable="true"
      @keyup="getFocusFromTab($event); handleCaret($event)"
      @paste="pastePlainText"
      @keydown="handleKeyboard"
      @mouseup="handleMouseUp"
      @blur="save"
      v-html="content"
      ref="block"
      class="publii-block-list" />

    <inline-menu ref="inline-menu" />

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import AdvancedConfig from './../../mixins/AdvancedConfig.vue';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import InlineMenu from './../../mixins/InlineMenu.vue';
import InlineMenuUI from './../../helpers/InlineMenuUI.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'List',
  mixins: [
    AdvancedConfig,
    Block,
    InlineMenu
  ],
  components: {
    'inline-menu': InlineMenuUI,
    'top-menu': TopMenuUI
  },
  data () {
    return {
      config: {
        listType: 'ul',
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
      },
      content: '<li></li>',
      topMenuConfig: [
        {
          activeState: function () { return this.config.listType === 'ul'; },
          onClick: function () { this.setListType('ul'); },
          icon: 'unordered-list'
        },
        {
          activeState: function () { return this.config.listType === 'ol'; },
          onClick: function () { this.setListType('ol'); },
          icon: 'ordered-list'
        },
        {
          activeState: function () { return false; },
          onClick: function () { return this.indentList(); },
          icon: 'nesting'
        },
        {
          activeState: function () { return false; },
          onClick: function () { return this.outdentList(); },
          icon: 'flattening'
        }
      ]
    };
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content = this.inputContent;

    if (!this.inputContent) {
      this.content = '<li></li>';
    }
  },
  methods: {
    handleKeyboard (e) {
      if (
        e.code === 'Backspace' &&
        (
          this.$refs['block'].innerHTML === '<li></li>' ||
          this.$refs['block'].innerHTML === '<li><br></li>'
        )
      ) {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }

      if (
        e.code === 'Enter' &&
        (
          (
            this.$refs['block'].innerHTML.substr(-13) === '<li><br></li>' ||
            this.$refs['block'].innerHTML.substr(-9) === '<li></li>'
          ) && this.$refs['block'].querySelectorAll('li').length > 1
        )
      ) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        this.$refs['block'].innerHTML = this.$refs['block'].innerHTML.substr(0, this.$refs['block'].innerHTML.length - 13);
        e.returnValue = false;
      }
    },
    setListType (type) {
      this.save();
      this.config.listType = type;
    },
    indentList () {
      document.execCommand('indent', false, null);

      setTimeout(() => {
        if (
          this.$refs['block'].innerHTML.indexOf('<ul><ul>') > -1 ||
          this.$refs['block'].innerHTML.indexOf('<ol><ol>') > -1
        ) {
          document.execCommand('undo', false, null);
        }
      }, 0);
    },
    outdentList () {
      document.execCommand('outdent', false, null);
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
.publii-block-list {
  outline: none;
  width: 100%;

  li {
    width: 100%;
  }
}
</style>
