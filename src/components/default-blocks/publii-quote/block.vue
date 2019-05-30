<template>
  <div class="publii-block-quote-wrapper">
    <div
      :class="{ 'publii-block-quote-form': true, 'is-visible': view === 'code' }"
      ref="block">
      <textarea
        @keyup="getFocusFromTab"
        @keydown="handleTextKeyboard"
        @blur="save"
        ref="contentText"
        placeholder="Quote text"
        v-model="content.text"></textarea>
      <input
        type="text"
        @keydown="handleAuthorKeyboard"
        @blur="save"
        v-model="content.author"
        placeholder="Quote author"
        ref="contentAuthor" />
    </div>
    <blockquote
      v-if="view === 'preview'"
      class="publii-block-quote"
      ref="block">
      <p v-html="content.text" />
      <cite v-html="content.author" />
    </blockquote>
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import HasPreview from './../../mixins/HasPreview.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements,
    HasPreview
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
    this.view = (this.content.text === '' && this.content.author === '') ? 'code' : 'preview';
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
      this.content.text = this.$refs['contentText'].value;
      this.content.author = this.$refs['contentAuthor'].value;

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

  &-form {
    display: none;
    padding: 20px 0;

    &.is-visible {
      display: block;
    }

    input,
    textarea {
      border: 1px solid #ddd;
      border-radius: 4px;
      display: block;
      font-size: 16px;
      padding: 20px;
      width: 100%;
    }

    input {
      padding: 10px 20px;
    }

    textarea {
      height: 150px;
      margin-bottom: 16px;
    }
  }
}
</style>
