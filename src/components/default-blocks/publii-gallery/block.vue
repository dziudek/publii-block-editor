<template>
  <div
    class="publii-block-gallery-wrapper"
    @dragover.stop.prevent="dragOver"
    @dragleave.stop.prevent="dragLeave"
    @drop.stop.prevent="drop"
    @dblclick.stop.prevent="toggleView()">
    <draggable
      v-if="content.images.length > 0 && view === 'preview'"
      ref="block"
      v-model="content.images"
      :data-cols="config.advanced.columns"
      :data-count="content.images.length"
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

        <button
          class="publii-block-gallery-item-delete"
          @click.stop.prevent="removeImage(index)">
          <icon name="trash" />
        </button>
      </div>
    </draggable>

    <div
      v-if="view === 'edit'"
      class="publii-block-gallery-list">
      <div
        v-for="(image, index) of content.images"
        :key="'gallery-item-' + index"
        class="publii-block-gallery-list-item">
        <div class="publii-block-gallery-list-item-image">
          <img
            :src="image.src"
            :height="image.height"
            :width="image.width" />
        </div>

        <div class="publii-block-gallery-list-item-config">
          <p>
            <label>Image alternative text:</label>
            <input type="text" v-model="image.alt" />
          </p>

          <p>
            <label>Image caption text:</label>
            <input type="text" v-model="image.caption" />
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="content.images.length === 0 && editor.bulkOperationsMode && view === 'preview'"
      class="publii-block-gallery-empty-state">
      Empty gallery block
    </div>

    <div
      v-if="content.images.length === 0 && !editor.bulkOperationsMode && view === 'preview'"
      :class="{ 'publii-block-gallery-form': true, 'is-visible': content.images.length === 0 }"
      ref="block">
      <div
        :class="{ 'publii-block-gallery-uploader': true, 'is-hovered': isHovered }">
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
      view: 'preview',
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
            width: 320,
            alt: '',
            caption: ''
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
    removeImage (index) {
      this.content.images.splice(index, 1);
    },
    toggleView () {
      if (!this.content.images.length) {
        return;
      }

      if (this.view === 'preview') {
        this.view = 'edit';
      } else if (this.view === 'edit') {
        this.view = 'preview';
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
  flex-wrap: wrap;
  margin: 0 -1%;
  outline: none;
  position: relative;

  &-empty-state {
    color: $block-editor-color-text-medium;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
  }

  &-item {
    cursor: move;
    padding: 1%;
    position: relative;
    width: calc(100% / 3);

    & > img {
      display: block;
      height: auto;
      max-width: 100%;
      width: auto;
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
      left: 20px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
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

    &:hover {
      .publii-block-gallery-item-delete {
        opacity: 1;
        pointer-events: auto;
      }
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

  &-list {
    &-item {
      align-items: center;
      display: flex;

      &-image {
        height: 120px;
        margin: 10px 20px 10px 0;
        overflow: hidden;
        position: relative;
        width: 120px;

        img {
          height: auto;
          left: 50%;
          width: 100%;
          position: absolute;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }

      &-config {
        width: calc(100% - 140px);

        p {
          margin: 0;

          label {
            display: block;
            font-size: 12px;
          }

          input {
            width: 100%;
          }
        }
      }
    }
  }
}

@for $i from 1 through 8 {
  .publii-block-gallery[data-cols="#{$i}"] .publii-block-gallery-item {
    flex-grow: 1;
    width: calc(100% / #{$i});
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