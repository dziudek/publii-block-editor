<template>
  <blockquote ref="block">
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
import Block from './../Block.vue';
import ContentEditableImprovements from './../helpers/ContentEditableImprovements.vue';

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

<style scoped lang="scss">
blockquote {
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
        opacity: .5;
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
        opacity: .5;
      }
    }
  }
}
</style>
