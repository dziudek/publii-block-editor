<template>
  <div class="publii-block-image-wrapper">
    <figure
      v-if="view === 'preview' || content.image !== ''"
      ref="block"
      class="publii-block-image">
      <img :src="content.image" />
      <button
        v-if="view === 'code' && !$parent.popupOpened"
        class="publii-block-image-delete"
        @click.stop.prevent="clearImage()">
        <icon name="trash" />
      </button>
      <figcaption v-if="content.caption !== '' && view === 'preview'">
        {{ content.caption }}
      </figcaption>
    </figure>

    <div
      :class="{ 'publii-block-image-form': true, 'is-visible': view === 'code' }"
      ref="block">
      <div
        v-if="content.image === ''"
        :class="{ 'publii-block-image-uploader': true, 'is-hovered': isHovered }"
        @drag.stop.prevent
        @dragstart.stop.prevent
        @dragend.stop.prevent
        @dragover.stop.prevent="dragOver"
        @dragenter.stop.prevent
        @dragleave.stop.prevent="dragLeave"
        @drop.stop.prevent="drop">
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
      isHovered: false,
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
    this.content.image = this.inputContent.image || '';
    this.content.alt = this.inputContent.alt || '';
    this.content.caption = this.inputContent.caption || '';
    this.view = (this.content.image === '') ? 'code' : 'preview';
  },
  methods: {
    dragOver (e) {
      this.isHovered = true;
    },
    dragLeave (e) {
      this.isHovered = false;
    },
    drop (e) {
      let blob = e.dataTransfer.items[0].getAsFile();
      this.content.image = window.URL.createObjectURL(blob);
      this.isHovered = false;
    },
    clearImage () {
      this.content.image = '';
      this.isHovered = false;
    },
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
  margin: 20px 0 0 0;
  outline: none;
  position: relative;

  & > img {
    display: block;
    height: auto;
    margin: 0;
    max-width: 100%;
  }

  & > figcaption {
    display: block;
    font-size: 13px;
    font-style: italic;
    padding: 10px 0;
    text-align: center;
  }

  &-delete {
    align-items: center;
    background: $block-editor-color-danger;
    border: none;
    border-radius: $block-editor-form-input-border-radius;
    color: $block-editor-color-light;
    cursor: pointer;
    display: flex;
    height: 24px;
    justify-content: center;
    position: absolute;
    right: 20px;
    top: 20px;
    transition: all .25s ease-out;
    width: 24px;
    z-index: 2;

    &:active,
    &:focus,
    &:hover {
      background: $block-editor-color-light;
      color: $block-editor-color-danger;
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

    &.is-hovered {
      border-color: $block-editor-color-primary;
    }

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
