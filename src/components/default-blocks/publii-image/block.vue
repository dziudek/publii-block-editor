<template>
  <div class="publii-block-image-wrapper">
    <figure
      v-if="view === 'preview' || content.image !== ''"
      ref="block"
      :class="{ 'publii-block-image': true, 'is-wide': config.imageAlign === 'wide', 'is-full': config.imageAlign === 'full' }">
      <img
        :src="content.image"
        :height="content.imageHeight"
        :width="content.imageWidth" />

      <button
        v-if="view === 'code' && !$parent.uiOpened"
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
            v-if="!imageUploadInProgress"
            name="image"
            height="50"
            width="100" />
          <span v-if="!imageUploadInProgress">
            Drop to upload your photo or
          </span>
          <button
            v-if="!imageUploadInProgress"
            @click="filePickerCallback">
            Select file
          </button>
          <span
            v-if="imageUploadInProgress"
            class="publii-block-image-uploader-loader"></span>
        </div>
      </div>

      <input
        type="text"
        @keydown="handleCaptionKeyboard"
        @keyup="handleCaretCaption"
        @blur="save"
        v-model="content.caption"
        placeholder="Enter a caption"
        ref="contentCaption" />
      <input
        type="text"
        @keydown="handleAltKeyboard"
        @keyup="handleCaretAlt"
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
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import HasPreview from './../../mixins/HasPreview.vue';
import LinkConfig from './../../mixins/LinkConfig.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'PImage',
  mixins: [
    Block,
    ContentEditableImprovements,
    HasPreview,
    LinkConfig
  ],
  components: {
    'icon': EditorIcon,
    'top-menu': TopMenuUI
  },
  data () {
    return {
      caretIsAtStartCaption: false,
      caretIsAtEndCaption: false,
      caretIsAtStartAlt: false,
      caretIsAtEndAlt: false,
      isHovered: false,
      imageUploadInProgress: false,
      config: {
        imageAlign: 'center',
        link: {
          url: '',
          noFollow: false,
          targetBlank: false
        },
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id')
        }
      },
      content: {
        image: '',
        imageHeight: '',
        imageWidth: '',
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
        },
        {
          activeState: () => this.config.link.url !== '',
          onClick: this.showLinkPopup,
          icon: 'link'
        },
        {
          activeState: () => false,
          onClick: this.removeLink,
          isVisible: () => this.config.link.url !== '',
          icon: 'unlink'
        }
      ]
    };
  },
  computed: {
    isInsidePublii () {
      return !!document.getElementById('post-editor-fake-image-uploader');
    }
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content.image = this.inputContent.image || '';
    this.content.alt = this.inputContent.alt || '';
    this.content.caption = this.inputContent.caption || '';
    this.view = (this.content.image === '') ? 'code' : 'preview';
    this.initFakeFilePicker();
    this.setParentCssClasses(this.config.imageAlign);
  },
  methods: {
    dragOver (e) {
      this.isHovered = true;
    },
    dragLeave (e) {
      this.isHovered = false;
    },
    drop (e) {
      if (this.isInsidePublii) {
        let files = e.dataTransfer.files;
        let siteName = window.app.$store.state.currentSite.config.name;
        this.imageUploadInProgress = true;

        if (!files[0] || !files[0].path) {
          this.imageUploadInProgress = false;
        } else {
          const { ipcRenderer } = require('electron');

          ipcRenderer.send('app-image-upload', {
            'id': this.editor.config.postID,
            'site': siteName,
            'path': files[0].path
          });

          ipcRenderer.once('app-image-uploaded', (event, data) => {
            if (data.baseImage && data.baseImage.size && data.baseImage.size.length >= 2) {
              this.content.imageWidth = data.baseImage.size[0];
              this.content.imageHeight = data.baseImage.size[1];
              this.content.image = data.baseImage.url;
            } else {
              this.content.image = data.url;
            }

            this.imageUploadInProgress = false;
          });
        }
      } else {
        let blob = e.dataTransfer.items[0].getAsFile();
        this.content.image = window.URL.createObjectURL(blob);
      }

      this.isHovered = false;
    },
    initFakeFilePicker () {
      if (!this.isInsidePublii) {
        return;
      }

      const { ipcRenderer } = require('electron');
      let imageUploader = document.getElementById('post-editor-fake-image-uploader');

      imageUploader.addEventListener('change', () => {
        if (!imageUploader.value) {
          return;
        }

        setTimeout(() => {
          if (!this.fileSelectionCallback) {
            return;
          }

          let filePath = false;

          if (imageUploader.files) {
            filePath = imageUploader.files[0].path;
          }

          if (!filePath) {
            return;
          }

          this.imageUploadInProgress = true;
          // eslint-disable-next-line
          ipcRenderer.send('app-image-upload', {
            id: this.postID,
            site: window.app.$store.state.currentSite.config.name,
            path: filePath,
            imageType: 'contentImages'
          });

          // eslint-disable-next-line
          ipcRenderer.once('app-image-uploaded', (event, data) => {
            this.content.imageWidth = data.baseImage.size[0];
            this.content.imageHeight = data.baseImage.size[1];
            this.content.image = data.baseImage.url;
            this.fileSelectionCallback = false;
            this.imageUploadInProgress = false;
          });

          imageUploader.value = '';
        }, 50);
      });
    },
    filePickerCallback () {
      this.fileSelectionCallback = true;
      document.getElementById('post-editor-fake-image-uploader').click();
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
      this.setParentCssClasses(newValue);
    },
    setParentCssClasses (imageMode) {
      if (imageMode === 'full') {
        this.$parent.addCustomCssClass('contains-full-image');
      } else {
        this.$parent.removeCustomCssClass('contains-full-image');
      }

      if (imageMode === 'wide') {
        this.$parent.addCustomCssClass('contains-wide-image');
      } else {
        this.$parent.removeCustomCssClass('contains-wide-image');
      }
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
    handleCaretCaption (e) {
      if (e.code === 'ArrowUp' && this.getCursorPosition('contentCaption') === 0) {
        if (!this.caretIsAtStartCaption) {
          this.caretIsAtStartCaption = true;
          return;
        }

        let previousBlockID = this.findPreviousBlockID();

        if (previousBlockID) {
          this.editor.$refs['block-wrapper-' + previousBlockID][0].blockClick();
          this.editor.$refs['block-' + previousBlockID][0].focus();
        }
      }

      if (e.code === 'ArrowDown' && this.getCursorPosition('contentCaption') >= this.$refs['contentCaption'].value.length - 2) {
        if (!this.caretIsAtEndCaption) {
          this.caretIsAtEndCaption = true;
          return;
        }

        this.$refs['contentAlt'].focus();
        e.returnValue = false;
      }

      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        this.caretIsAtStartCaption = false;
        this.caretIsAtEndCaption = false;
      }
    },
    handleCaretAlt (e) {
      if (e.code === 'ArrowUp' && this.getCursorPosition('contentAlt') === 0) {
        if (!this.caretIsAtStartAlt) {
          this.caretIsAtStartAlt = true;
          return;
        }

        this.$refs['contentCaption'].focus();
        e.returnValue = false;
      }

      if (e.code === 'ArrowDown' && this.getCursorPosition('contentAlt') >= this.$refs['contentAlt'].value.length - 2) {
        if (!this.caretIsAtEndAlt) {
          this.caretIsAtEndAlt = true;
          return;
        }

        let nextBlockID = this.findNextBlockID();

        if (nextBlockID) {
          this.editor.$refs['block-wrapper-' + nextBlockID][0].blockClick();
          this.editor.$refs['block-' + nextBlockID][0].focus('none');
        }
      }

      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        this.caretIsAtStartAlt = false;
        this.caretIsAtEndAlt = false;
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
    transition: all .25s ease-out;
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
      order: -1;
    }

    input,
    textarea {
      border: 1px solid $block-editor-form-input-border;
      border-radius: $block-editor-form-input-border-radius;
      display: block;
      font-size: inherit;
      line-height: inherit;
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
    position: relative;
    width: 100%;

    &.is-hovered {
      border-color: $block-editor-color-primary;
    }

    &-loader {
      animation: loader 1s linear infinite;
      border: 3px solid $block-editor-color-primary;
      border-left-color: transparent;
      border-radius: 50%;
      display: block;
      height: 32px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 32px!important;
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

  &.is-wide {
    & > img {
      margin: 0 -84px;
      max-width: calc(100% + 168px);
    }

    .publii-block-image-delete {
      right: -64px;
    }
  }
}

@keyframes loader {
  from {
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateX(-50%) translateY(-50%) rotate(360deg);
  }
}
</style>
