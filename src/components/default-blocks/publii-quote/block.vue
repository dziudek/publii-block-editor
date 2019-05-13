<template>
  <blockquote
    class="publii-block-quote"
    ref="block">
    <p
      contenteditable="true"
      v-html="content.text"
      @keyup="getFocusFromTab"
      @paste="pastePlainText"
      @keydown="handleTextKeyboard"
      ref="contentText" />
    <cite
      contenteditable="true"
      v-html="content.author"
      @keydown="handleAuthorKeyboard"
      ref="contentAuthor" />
  </blockquote>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  data () {
    return {
      config: {},
      content: {
        text: '',
        author: ''
      }
    };
  },
  mounted () {
    this.content.text = this.inputContent.text;
    this.content.author = this.inputContent.author;
  },
  methods: {
    focus () {
      this.$refs['contentText'].focus();
      this.setCursorAtEndOfElement('contentText');
    },
    handleKeyboard (e) {
      if (e.code === 'Backspace' && this.$refs['contentText'].innerHTML === '' && this.$refs['contentAuthor'].innerHTML === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    handleTextKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$refs['contentAuthor'].focus();
        e.returnValue = false;
      }

      this.handleKeyboard(e);
    },
    handleAuthorKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      this.handleKeyboard(e);
    },
    save () {
      this.content.text = this.$refs['contentText'].innerHTML;
      this.content.author = this.$refs['contentAuthor'].innerHTML;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: JSON.parse(JSON.stringify(this.content))
      });
    }
  }
}
</script>

<style lang="scss">
.publii-block-quote {
  border-left: 3px solid #aaa;
  margin: 20px 0;
  outline: none;
  padding: 10px 20px;

  p {
    margin: 0;
    outline: none;

    &:empty {
      &:before {
        content: "Quote text";
        opacity: .35;
      }
    }
  }

  cite {
    display: block;
    font-size: 12px;
    margin-top: 5px;
    outline: none;

    &:empty {
      &:before {
        content: "Quote author";
        opacity: .35;
      }
    }
  }
}
</style>
