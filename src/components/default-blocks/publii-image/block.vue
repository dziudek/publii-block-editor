<template>
  <div class="publii-block-image-wrapper">
    <div
      :class="{ 'publii-block-image-form': true, 'is-visible': view === 'code' }"
      ref="block">
      <div class="publii-block-image-uploader">
        <div class="publii-block-image-uploader-inner">
          <icon
            name="image"
            height="50"
            width="100" />
          <span>Drop to upload your photo or</span>
          <button>Select file</button>
        </div>
      </div>

      <input
        type="text"
        @keydown="handleCaptionKeyboard"
        @blur="save"
        v-model="content.caption"
        placeholder="Enter a caption"
        ref="contentCaption" />
      <input
        type="text"
        @keydown="handleAltKeyboard"
        @blur="save"
        v-model="content.alt"
        placeholder="Enter alt text"
        ref="contentAlt" />
    </div>
    <blockquote
      v-if="view === 'preview'"
      class="publii-block-quote"
      ref="block">

    </blockquote>

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import HasPreview from './../../mixins/HasPreview.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'PImage',
  mixins: [
    Block,
    ContentEditableImprovements,
    HasPreview
  ],
  components: {
    'icon': EditorIcon,
    'top-menu': TopMenuUI
  },
  data () {
    return {
      config: {
        imageAlign: 'center'
      },
      content: {
        image: '',
        alt: '',
        caption: ''
      },
      topMenuConfig: [
        {
          activeState: function () { return this.config.imageAlign === 'center'; },
          onClick: function () { this.alignImage('center'); },
          icon: 'center'
        },
        {
          activeState: function () { return this.config.imageAlign === 'wide'; },
          onClick: function () { this.alignImage('wide'); },
          icon: 'wide'
        },
        {
          activeState: function () { return this.config.imageAlign === 'full'; },
          onClick: function () { this.alignImage('full'); },
          icon: 'full'
        }
      ]
    };
  },
  mounted () {
    this.content.image = this.inputContent.image;
    this.content.alt = this.inputContent.alt;
    this.content.caption = this.inputContent.caption;
    this.view = (this.content.image === '') ? 'code' : 'preview';
  },
  methods: {
    setView (newView) {
      if (
        this.view === 'code' &&
        newView === 'preview'
      ) {
        this.save();
      }

      if (
        !this.content.image &&
        newView === 'preview'
      ) {
        this.view = 'code';
      } else {
        setTimeout(() => {
          this.view = newView;
        }, 0);
      }
    },
    alignImage (newValue) {
      this.config.imageAlign = newValue;
    },
    focus () {
      this.view = 'code';

      setTimeout(() => {
        this.setCursorAtEndOfElement('contentCaption', false);
      }, 0);
    },
    handleCaptionKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$refs['contentAlt'].focus();
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['contentCaption'].value === '' && this.$refs['contentAlt'].value === '') {
        this.$bus.$emit('block-editor-delete-block', this.id);
        e.returnValue = false;
      }
    },
    handleAltKeyboard (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        this.$bus.$emit('block-editor-add-block', 'publii-paragraph', this.id);
        e.returnValue = false;
      }

      if (e.code === 'Backspace' && this.$refs['contentCaption'].value === '') {
        this.$refs['contentCaption'].focus();
        e.returnValue = false;
      }
    },
    save () {
      this.content.alt = this.$refs['contentAlt'].value;
      this.content.caption = this.$refs['contentCaption'].value;

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
@import '../../../assets/variables.scss';

.publii-block-image {
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

  &-form {
    display: none;
    padding: 20px 0;

    &.is-visible {
      display: block;
    }

    input,
    textarea {
      border: 1px solid $block-editor-form-input-border;
      border-radius: $block-editor-form-input-border-radius;
      display: block;
      font-size: 16px;
      outline: none;
      padding: 20px;
      width: 100%;
    }

    input {
      padding: 10px 20px;
    }

    input + input {
      margin-top: 16px;
    }
  }

  &-uploader {
    border: 1px dashed $block-editor-form-input-border;
    border-radius: $block-editor-form-input-border-radius;
    height: 250px;
    margin: 0 0 16px 0;
    padding: 10px;
    width: 100%;

    &-inner {
      align-items: center;
      background: $color-editor-color-light-medium;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      height: 228px;
      width: 100%;

      svg {
        margin-top: 30px;
        opacity: .35;
      }

      span {
        color: $block-editor-color-text-medium;
        display: block;
        font-size: 16px;
        text-align: center;
        width: 100%;
      }

      button {
        background: $block-editor-color-text-medium;
        border-radius: $block-editor-form-input-border-radius;
        color: $block-editor-color-light;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        margin-bottom: 30px;
        width: 160px;

        &:active,
        &:focus,
        &:hover {
          background: $block-editor-color-text-medium-dark;
        }
      }
    }
  }
}
</style>
