<template>
  <div class="publii-block-gallery-wrapper">
    <draggable
      v-if="content.images.length > 0"
      ref="block"
      v-model="content.images"
      :data-cols="config.advanced.columns"
      @start="draggingInProgress = true"
      @end="draggingInProgress = false"
      :class="{ 'publii-block-gallery': true, 'is-wide': config.imageAlign === 'wide', 'is-full': config.imageAlign === 'full' }">
      <div
        v-for="(image, index) of content.images"
        :key="'gallery-item-' + index"
        class="publii-block-gallery-item">
        <img
          :src="image.src"
          :height="image.height"
          :width="image.width" />
      </div>
    </draggable>

    <div
      :class="{ 'publii-block-gallery-form': true, 'is-visible': content.images.length === 0 }"
      ref="block">
      <div
        v-if="content.images.length === 0"
        :class="{ 'publii-block-gallery-uploader': true, 'is-hovered': isHovered }"
        @drag.stop.prevent
        @dragstart.stop.prevent
        @dragend.stop.prevent
        @dragover.stop.prevent="dragOver"
        @dragenter.stop.prevent
        @dragleave.stop.prevent="dragLeave"
        @drop.stop.prevent="drop">
        <div class="publii-block-gallery-uploader-inner">
          <icon
            v-if="!imageUploadInProgress"
            name="blank-image"
            height="48"
            width="68" />
          <span v-if="!imageUploadInProgress">
            Drop to upload your photos or
          </span>
          <button
            v-if="!imageUploadInProgress"
            @click="filePickerCallback">
            Select files
          </button>
          <span
            v-if="imageUploadInProgress"
            class="publii-block-gallery-uploader-loader"></span>
        </div>
      </div>
    </div>

    <top-menu
      ref="top-menu"
      :config="topMenuConfig" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Block from './../../Block.vue';
import ConfigForm from './config-form.json';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';
import EditorIcon from './../../elements/EditorIcon.vue';
import TopMenuUI from './../../helpers/TopMenuUI.vue';

export default {
  name: 'PGallery',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  components: {
    'icon': EditorIcon,
    'top-menu': TopMenuUI,
    'draggable': Draggable
  },
  data () {
    return {
      draggingInProgress: false,
      isHovered: false,
      imageUploadInProgress: false,
      config: {
        imageAlign: 'center',
        advanced: {
          cssClasses: this.getAdvancedConfigDefaultValue('cssClasses'),
          id: this.getAdvancedConfigDefaultValue('id'),
          columns: this.getAdvancedConfigDefaultValue('columns')
        }
      },
      content: {
        images: []
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
  computed: {
    isInsidePublii () {
      return !!window.process;
    },
    isEmpty () {
      return this.content.images.length === 0;
    }
  },
  beforeCreate () {
    this.configForm = ConfigForm;
  },
  mounted () {
    this.content.images = this.inputContent.images || [];
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
      if (this.$ipcRenderer) {
        /*
        let files = e.dataTransfer.files;
        let siteName = window.publiiSiteName;
        this.imageUploadInProgress = true;

        if (!files[0] || !files[0].path) {
          this.imageUploadInProgress = false;
        } else {
          this.$ipcRenderer.send('app-image-upload', {
            'id': this.editor.config.postID,
            'site': siteName,
            'path': files[0].path
          });

          this.$ipcRenderer.once('app-image-uploaded', (event, data) => {
            if (data.baseImage && data.baseImage.size && data.baseImage.size.length >= 2) {
              this.content.imageWidth = data.baseImage.size[0];
              this.content.imageHeight = data.baseImage.size[1];
              this.content.images = data.baseImage.url;
            } else {
              this.content.images = data.url;
            }

            this.imageUploadInProgress = false;
          });
        }
        */
      } else {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          let blob = e.dataTransfer.items[i].getAsFile();
          this.content.images.push({
            src: window.URL.createObjectURL(blob),
            height: 240,
            width: 320
          });
        }
      }

      this.isHovered = false;
    },
    initFakeFilePicker () {
      // if (!this.$ipcRenderer) {
      return false;
      // }

      /*
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
          this.$ipcRenderer.send('app-image-upload', {
            id: this.postID,
            site: window.publiiSiteName,
            path: filePath,
            imageType: 'contentImages'
          });

          // eslint-disable-next-line
          this.$ipcRenderer.once('app-image-uploaded', (event, data) => {
            this.content.imageWidth = data.baseImage.size[0];
            this.content.imageHeight = data.baseImage.size[1];
            this.content.image = data.baseImage.url;
            this.fileSelectionCallback = false;
            this.imageUploadInProgress = false;
          });

          imageUploader.value = '';
        }, 50);
      });
      */
    },
    filePickerCallback () {
      this.fileSelectionCallback = true;
      document.getElementById('post-editor-fake-image-uploader').click();
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
    save () {
      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: JSON.parse(JSON.stringify(this.content))
      });
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-save-link-popup', this.setLink);
  }
}
</script>

<style lang="scss">
@import '../../../vendors/modularscale';
@import '../../../assets/functions.scss';
@import '../../../assets/variables.scss';
@import '../../../assets/mixins.scss';

.publii-block-gallery {
  display: flex;
  margin: 0 -1%;
  outline: none;
  position: relative;

  &-item {
    cursor: move;
    padding: 1%;
    width: calc(100% / 3);

    & > img {
      height: auto;
      max-width: 100%;
      width: auto;
    }
  }

  & > img {
    display: block;
    height: auto;
    margin: 0 auto;
    max-width: 100%;
    transition: all .25s ease-out;
  }

  & > figcaption {
    display: block;
    padding: baseline(3) 0 0;
  }

  &-delete {
    align-items: center;
    background: $block-editor-color-danger;
    border: none;
    border-radius: $block-editor-form-input-border-radius;
    color: $block-editor-color-light;
    cursor: pointer;
    display: flex;
    height: 34px;
    justify-content: center;
    position: absolute;
    right: 20px;
    top: 20px;
    transition: all .25s ease-out;
    width: 34px;
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
    padding: baseline(5) 0;

    &.is-visible {
      display: block;
      order: -1;
    }

    input,
    textarea {
      border: 1px solid $block-editor-form-input-border;
      border-radius: $block-editor-form-input-border-radius;
      display: block;
      font-size: ms(-1);
      line-height: inherit;
      outline: none;
      padding: baseline(5);
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
}

.publii-block-gallery[data-cols="1"] .publii-block-gallery-item {
  width: 100%;
}

.publii-block-gallery[data-cols="2"] .publii-block-gallery-item {
  width: calc(100% / 2);
}

.publii-block-gallery[data-cols="3"] .publii-block-gallery-item {
  width: calc(100% / 3);
}

.publii-block-gallery[data-cols="4"] .publii-block-gallery-item {
  width: calc(100% / 4);
}

.publii-block-gallery[data-cols="5"] .publii-block-gallery-item {
  width: calc(100% / 5);
}

.publii-block-gallery[data-cols="6"] .publii-block-gallery-item {
  width: calc(100% / 6);
}

.publii-block-gallery[data-cols="7"] .publii-block-gallery-item {
  width: calc(100% / 7);
}

.publii-block-gallery[data-cols="8"] .publii-block-gallery-item {
  width: calc(100% / 8);
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
