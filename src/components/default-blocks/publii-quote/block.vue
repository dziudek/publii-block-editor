<template>
  <blockquote
    class="publii-block-quote"
    ref="block">
    <p
      contenteditable="true"
      v-html="content.text"
      ref="contentText" />
    <cite
      contenteditable="true"
      v-html="content.author"
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
    this.$refs['contentText'].addEventListener('keydown', this.handleTextEnterKey);
    this.$refs['contentAuthor'].addEventListener('keydown', this.handleAuthorEnterKey);
  },
  methods: {
    focus () {
      this.$refs['contentText'].focus();
    },
    handleTextEnterKey (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$refs['contentAuthor'].focus();
        e.returnValue = false;
      }
    },
    handleAuthorEnterKey (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }
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
  },
  beforeDestroy () {
    this.$refs['contentText'].removeEventListener('keydown', this.handleTextEnterKey);
    this.$refs['contentAuthor'].removeEventListener('keydown', this.handleAuthorEnterKey);
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
