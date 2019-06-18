<template>
  <div>
    <component
      :is="'h' + config.headingLevel"
      contenteditable="true"
      @keyup="getFocusFromTab($event); handleCaret($event)"
      @keydown="handleKeyboard"
      @paste="pastePlainText"
      @blur="save"
      ref="block"
      :style="'text-align: ' + config.textAlign + ';'"
      class="publii-block-header"
      v-html="content" />

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'Header',
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
        headingLevel: 2,
        textAlign: 'left'
      },
      content: '',
      topMenuConfig: [
        {
          activeState: function () { return this.config.headingLevel === 1; },
          onClick: function () { this.setHeadingLevel(1); },
          icon: 'h1'
        },
        {
          activeState: function () { return this.config.headingLevel === 2; },
          onClick: function () { this.setHeadingLevel(2); },
          icon: 'h2'
        },
        {
          activeState: function () { return this.config.headingLevel === 3; },
          onClick: function () { this.setHeadingLevel(3); },
          icon: 'h3'
        },
        {
          activeState: function () { return this.config.headingLevel === 4; },
          onClick: function () { this.setHeadingLevel(4); },
          icon: 'h4'
        },
        {
          activeState: function () { return this.config.headingLevel === 5; },
          onClick: function () { this.setHeadingLevel(5); },
          icon: 'h5'
        },
        {
          activeState: function () { return this.config.headingLevel === 6; },
          onClick: function () { this.setHeadingLevel(6); },
          icon: 'h6'
        },
        {
          activeState: function () { return this.config.textAlign === 'left'; },
          onClick: function () { this.alignText('left'); },
          icon: 'align-left'
        },
        {
          activeState: function () { return this.config.textAlign === 'center'; },
          onClick: function () { this.alignText('center'); },
          icon: 'align-center'
        },
        {
          activeState: function () { return this.config.textAlign === 'right'; },
          onClick: function () { this.alignText('right'); },
          icon: 'align-right'
        },
        {
          activeState: () => false,
          onClick: () => false,
          icon: 'gear'
        }
      ]
    };
  },
  mounted () {
    this.content = this.inputContent;
    this.config.headingLevel = this.inputConfig.headingLevel || 2;
  },
  methods: {
    handleKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        document.execCommand('insertHTML', false, '<line-separator />');

        if (this.$refs['block'].innerHTML.substr(-33) === '<line-separator></line-separator>') {
          this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
          this.$refs['block'].innerHTML = this.$refs['block'].innerHTML.replace('<line-separator></line-separator>', '');
        } else {
          let separatedContent = this.$refs['block'].innerHTML.split('<line-separator></line-separator>');
          let firstPart = separatedContent[0];
          let secondPart = separatedContent[1];

          if (secondPart.substr(0, 4) === '<br>') {
            secondPart = secondPart.substr(4);
          }

          this.$refs['block'].innerHTML = firstPart;
          this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id, secondPart);
        }

        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['block'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    alignText (position) {
      this.config.textAlign = position;
    },
    setHeadingLevel (level) {
      this.save();
      this.config.headingLevel = level;
      this.save();
    },
    save () {
      this.content = this.$refs['block'].innerHTML.replace('<line-separator></line-separator>', '');

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  }
}
</script>

<style scoped lang="scss">
.publii-block-header {
  outline: none;
  width: 100%;

  &:empty {
    &:before {
      content: 'Insert title';
      opacity: .35;
    }
  }
}
</style>
