<template>
  <div
    class="editor"
    data-ui-opened-block=""
    ref="editor-main"
    @click="$bus.$emit('block-editor-deselect-blocks')">
    <div
      @click.stop
      :class="{ 'bulk-operations-bar': true, 'is-visible': showBulkOperationsBar }">
      <button
        v-if="bulkOperationsMode"
        :disabled="bulkOperationsLog.length === 0"
        @click.stop="undoBulkOperation">
        <icon name="dot" />
        Undo
      </button>
      <button
        v-if="!bulkOperationsMode"
        @click.stop="startBulkOperations">
        <icon name="edit-mode" />
        Batch operations
      </button>
      <button
        v-if="bulkOperationsMode"
        @click.stop="endBulkOperations">
        <icon name="edit-mode" />
        Close
      </button>
      <button
        v-if="bulkOperationsMode"
        @click.stop="cancelBulkOperations">
        <icon name="enter" />
        Cancel
      </button>
    </div>
    <div
      v-if="state.externalComponentsLoaded"
      class="editor-inner">
      <block-wrapper
        v-for="block of content"
        :id="block.id"
        :block-type="block.type"
        :key="'block-wrapper-' + block.id"
        :ref="'block-wrapper-' + block.id">
        <component
          :is="block.type"
          :id="block.id"
          :inputConfig="block.config"
          :inputContent="block.content"
          :key="'block-' + block.id"
          :ref="'block-' + block.id"
          :editor="$self" />
      </block-wrapper>
      <div
        class="editor-inner-trigger"
        @click="addNewParagraphAtEnd"></div>
    </div>

    <block-advanced-config />
    <block-link-popup />
  </div>
</template>

<script>
// core elements
import Vue from 'vue';
import Block from './Block.vue';
import BlockAdvancedConfig from './BlockAdvancedConfig.vue';
import BlockLinkPopup from './BlockLinkPopup.vue';
import BlockWrapper from './BlockWrapper.vue';
import ContentEditableImprovements from './helpers/ContentEditableImprovements.vue';
import { compileToFunctions } from 'vue-template-compiler';
import Icon from './elements/EditorIcon.vue';
// default blocks
import PubliiCode from './default-blocks/publii-code/block.vue';
import PubliiEmbed from './default-blocks/publii-embed/block.vue';
import PubliiHeader from './default-blocks/publii-header/block.vue';
import PubliiHtml from './default-blocks/publii-html/block.vue';
import PubliiImage from './default-blocks/publii-image/block.vue';
import PubliiList from './default-blocks/publii-list/block.vue';
import PubliiParagraph from './default-blocks/publii-paragraph/block.vue';
import PubliiReadmore from './default-blocks/publii-readmore/block.vue';
import PubliiSeparator from './default-blocks/publii-separator/block.vue';
import PubliiToc from './default-blocks/publii-toc/block.vue';
import PubliiQuote from './default-blocks/publii-quote/block.vue';
// extensions
import ShortcutManager from './extensions/ShortcutManager.js';
import ConversionHelpers from './extensions/ConversionHelpers.js';

export default {
  name: 'BlockEditor',
  components: {
    'block-advanced-config': BlockAdvancedConfig,
    'block-link-popup': BlockLinkPopup,
    'block-wrapper': BlockWrapper,
    'icon': Icon,
    'publii-code': PubliiCode,
    'publii-embed': PubliiEmbed,
    'publii-header': PubliiHeader,
    'publii-html': PubliiHtml,
    'publii-image': PubliiImage,
    'publii-list': PubliiList,
    'publii-paragraph': PubliiParagraph,
    'publii-readmore': PubliiReadmore,
    'publii-separator': PubliiSeparator,
    'publii-toc': PubliiToc,
    'publii-quote': PubliiQuote
  },
  computed: {
    hasReadMore () {
      return this.content.filter(block => block.type === 'publii-readmore').length > 0;
    }
  },
  data () {
    return {
      config: {
        postID: ''
      },
      bulkOperationsMode: false,
      showBulkOperationsBar: false,
      bulkContentBackup: '',
      bulkOperationsLog: [],
      state: {
        selectedBlockID: false,
        externalComponentsLoaded: false
      },
      internal: {
        lastScroll: 0,
        firstBlockID: 0,
        lastBlockID: 0,
        currentBlockID: 0,
        firstChangeDone: false,
        editorIsLoaded: false
      },
      extensions: {
        shortcutManager: new ShortcutManager(),
        conversionHelpers: new ConversionHelpers()
      },
      content: [
        {
          id: 1555941466744,
          type: 'publii-paragraph',
          content: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue. Cras mattis consectetur purus sit amet fermentum.',
          config: {}
        }
      ]
    };
  },
  watch: {
    content: {
      handler (newState) {
        this.$bus.$emit('block-editor-content-updated');

        if (!this.internal.firstChangeDone && this.internal.editorIsLoaded) {
          this.internal.firstChangeDone = true;

          if (this.$parent.$ipcRenderer) {
            this.$parent.$ipcRenderer.sendToHost('editor-content-updated');
          }
        }

        if (this.content.length) {
          let lastIndex = this.content.length - 1;
          this.internal.firstBlockID = this.content[0].id;
          this.internal.lastBlockID = this.content[lastIndex].id;
        }
      },
      deep: true
    }
  },
  beforeMount () {
    let externalComponent = document.createElement('script');
    externalComponent.setAttribute('src', 'external-component.js');
    document.body.appendChild(externalComponent);

    setTimeout(() => {
      this.state.externalComponentsLoaded = true;
    }, 500);
  },
  mounted () {
    this.$self = this;
    Vue.prototype.$rangy.init();
    this.$bus.$on('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$on('block-editor-move-block-down', this.moveBlockDown);
    this.$bus.$on('block-editor-save-block', this.saveBlock);
    this.$bus.$on('block-editor-delete-block', this.deleteBlock);
    this.$bus.$on('block-editor-duplicate-block', this.duplicateBlock);
    this.$bus.$on('block-editor-add-block', this.addNewBlock);
    this.$bus.$on('block-editor-merge-paragraphs', this.mergeParagraphs);
    this.$bus.$on('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
    this.$bus.$on('block-editor-ui-opened-for-block', this.uiOpenedForBlock);
    this.$bus.$on('block-editor-ui-closed-for-block', this.uiClosedForBlock);
    this.$bus.$on('block-editor-convert-block', this.convertBlock);
    this.$bus.$on('publii-block-editor-save', this.saveAllBlocks);
    this.$bus.$on('publii-block-editor-load', this.loadAllBlocks);
    this.$bus.$on('publii-block-editor-update-current-block-id', this.updateCurrentBlockID);
    this.initGlobals();

    setTimeout(() => {
      this.internal.editorIsLoaded = true;
    }, 1500);
  },
  methods: {
    initGlobals () {
      window.Vue = Vue;
      window.publiiBlockEditor = {};
      window.publiiBlockEditor.Block = Block;
      window.publiiBlockEditor.compileToFunctions = compileToFunctions;
      window.publiiBlockEditor.ContentEditableImprovements = ContentEditableImprovements;
    },
    moveBlockUp (blockID, startBlockTop) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex > 0) {
        let tempBlock = JSON.parse(JSON.stringify(this.content[blockIndex]));
        Vue.set(this.content, blockIndex, this.content[blockIndex - 1]);
        Vue.set(this.content, blockIndex - 1, tempBlock);
      }

      if (this.bulkOperationsMode && startBlockTop !== false) {
        this.bulkOperationsLog.push({
          type: 'move-up',
          blockID: blockID
        });
      }

      this.scrollWindow(blockID, startBlockTop);
    },
    moveBlockDown (blockID, startBlockTop) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex < this.content.length - 1) {
        let tempBlock = JSON.parse(JSON.stringify(this.content[blockIndex]));
        Vue.set(this.content, blockIndex, this.content[blockIndex + 1]);
        Vue.set(this.content, blockIndex + 1, tempBlock);
      }

      if (this.bulkOperationsMode && startBlockTop !== false) {
        this.bulkOperationsLog.push({
          type: 'move-down',
          blockID: blockID
        });
      }

      this.scrollWindow(blockID, startBlockTop);
    },
    scrollWindow (blockID, startBlockTop) {
      if (+new Date() < this.internal.lastScroll + 100) {
        return;
      }

      this.internal.lastScroll = +new Date();

      this.$nextTick(() => {
        let endBlockTop = this.$refs['block-wrapper-' + blockID][0].$refs['block-wrapper'].getBoundingClientRect().top;
        window.scrollBy(0, endBlockTop - startBlockTop);
      });
    },
    saveBlock (blockData) {
      let blockIndex = this.content.findIndex(el => el.id === blockData.id);

      if (blockIndex > -1) {
        this.content[blockIndex].content = blockData.content;
        this.content[blockIndex].config = blockData.config;
      }
    },
    deleteBlock (blockID, addFocusToPreviousBlock = true, undoBulkOperation = false) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);
      this.content.splice(blockIndex, 1);
      this.state.selectedBlockID = false;

      if (!undoBulkOperation) {
        if (blockIndex > 0 && addFocusToPreviousBlock) {
          this.$refs['block-' + this.content[blockIndex - 1].id][0].focus();
        }

        if (!this.content.length) {
          this.addNewBlock('publii-paragraph', false);
        }

        if (this.bulkOperationsMode) {
          let previousBlockID = 0;

          if (this.content[blockIndex - 1]) {
            previousBlockID = this.content[blockIndex - 1].id;
          }

          this.bulkOperationsLog.push({
            type: 'delete',
            blockID: blockID,
            prevBlockID: previousBlockID
          });
        }

        this.$refs['editor-main'].setAttribute('data-ui-opened-block', '');
      }
    },
    duplicateBlock (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);
      let blockCopy = JSON.parse(JSON.stringify(this.content[blockIndex]));
      blockCopy.id = +new Date();
      this.content.splice(blockIndex, 0, blockCopy);

      if (this.bulkOperationsMode) {
        this.bulkOperationsLog.push({
          type: 'duplicate',
          blockID: blockCopy.id
        });
      }
    },
    addNewBlock (blockType, afterBlockID = false, content = '') {
      let blockIndex = this.content.findIndex(el => el.id === afterBlockID);
      let blockConfig = {};
      this.$bus.$emit('block-editor-deselect-blocks');

      if (!afterBlockID) {
        blockIndex = -1;
      }

      if (blockType.indexOf('publii-header-') === 0) {
        let headerSize = parseInt(blockType.replace('publii-header-', ''), 10);
        blockConfig.headingLevel = headerSize;
        blockType = 'publii-header';
      }

      let newBlockID = +new Date();
      let newBlockObject = {
        id: newBlockID,
        type: blockType,
        content: content,
        config: blockConfig
      };
      this.content.splice(blockIndex + 1, 0, newBlockObject);

      setTimeout(() => {
        if (blockType === 'publii-readmore' || blockType === 'publii-separator') {
          let newlyAddedBlockIndex = this.content.findIndex(el => el.id === newBlockID);

          if (newlyAddedBlockIndex === this.content.length - 1) {
            this.addNewParagraphAtEnd();
          } else {
            let nextIndex = newlyAddedBlockIndex + 1;
            let nextBlockID = this.content[nextIndex].id;
            this.$refs['block-' + nextBlockID][0].focus('end');
            this.$bus.$emit('block-editor-block-selected', nextBlockID);
          }
        } else {
          if (content === '') {
            this.$refs['block-' + newBlockID][0].focus('end');
          } else {
            this.$refs['block-' + newBlockID][0].focus('start');
          }
        }
      }, 50);
    },
    addNewParagraphAtEnd () {
      let lastContentBlockIndex = this.content.length - 1;
      let lastContentBlock = this.content[lastContentBlockIndex];

      if (!lastContentBlock) {
        this.addNewBlock('publii-paragraph', false);
        return;
      }

      if (lastContentBlock.type === 'publii-paragraph' && lastContentBlock.content === '') {
        let blockID = lastContentBlock.id;
        this.$refs['block-' + blockID][0].focus();
        this.$refs['block-' + blockID][0].toggleNewBlockUIIcon();
        return;
      }

      this.addNewBlock('publii-paragraph', lastContentBlock.id);
    },
    mergeParagraphs (blockIDToMerge) {
      let blockIndex = this.content.findIndex(el => el.id === blockIDToMerge);

      if (blockIndex === 0) {
        return;
      }

      let previousBlockType = this.content[blockIndex - 1].type;
      let previousBlockID = this.content[blockIndex - 1].id;

      if (previousBlockType === 'publii-paragraph') {
        this.content[blockIndex - 1].content = this.content[blockIndex - 1].content + '<span class="temp-paragraph-merge-caret"></span>' + this.content[blockIndex].content;
        this.content.splice(blockIndex, 1);

        setTimeout(() => {
          this.$refs['block-' + previousBlockID][0].content = this.content[blockIndex - 1].content;
          this.$refs['block-' + previousBlockID][0].refresh();

          setTimeout(() => {
            let range = document.createRange();
            let caret = this.$refs['block-' + previousBlockID][0].$refs['block'].querySelector('.temp-paragraph-merge-caret');
            this.$refs['block-' + previousBlockID][0].focus('none');
            let sel = document.getSelection();

            setTimeout(() => {
              range.selectNodeContents(caret);
              range.deleteContents();
              sel.removeAllRanges();
              sel.addRange(range);
              sel.baseNode.parentNode.removeChild(sel.baseNode);
            }, 0);
          }, 0);
        }, 0);
      } else {
        this.$refs['block-' + previousBlockID][0].focus('end');
      }
    },
    uiClosedForBlock (blockID) {
      this.$refs['editor-main'].setAttribute('data-ui-opened-block', '');

      if (!this.bulkOperationsMode) {
        this.showBulkOperationsBar = false;
      }
    },
    uiOpenedForBlock (blockID) {
      this.$refs['editor-main'].setAttribute('data-ui-opened-block', blockID);
      this.showBulkOperationsBar = true;
    },
    loadAllBlocks () {
      let inputField = document.querySelector('#post-editor');

      if (inputField.value !== '') {
        this.content = JSON.parse(inputField.value);
      }
    },
    saveAllBlocks () {
      let inputField = document.querySelector('#post-editor');

      for (let block of this.content) {
        this.$refs['block-' + block.id][0].save();
      }

      inputField.value = JSON.stringify(this.content);
    },
    setPostID (postID) {
      this.config.postID = postID;
    },
    convertBlock (id, blockType, data) {
      let blockToConvertIndex = this.content.findIndex(block => block.id === id);

      Vue.set(this.content, blockToConvertIndex, {
        id: id,
        type: blockType,
        content: data.content,
        config: JSON.parse(JSON.stringify(data.config))
      });
    },
    startBulkOperations () {
      this.bulkOperationsMode = true;
      this.bulkContentBackup = JSON.stringify(this.content);
    },
    endBulkOperations () {
      this.bulkOperationsMode = false;
      this.showBulkOperationsBar = false;
      this.bulkOperationsLog = [];
    },
    undoBulkOperation () {
      let lastOperation = this.bulkOperationsLog.pop();

      if (lastOperation.type === 'move-up') {
        this.moveBlockDown(lastOperation.blockID, false);
      } else if (lastOperation.type === 'move-down') {
        this.moveBlockUp(lastOperation.blockID, false);
      } else if (lastOperation.type === 'delete') {
        let restoredCopy = JSON.parse(this.bulkContentBackup);
        let blockIndex = restoredCopy.findIndex(el => el.id === lastOperation.blockID);
        let blockObject = JSON.parse(JSON.stringify(restoredCopy[blockIndex]));
        let previousBlockIndex = this.content.findIndex(el => el.id === lastOperation.prevBlockID);
        this.content.splice(previousBlockIndex + 1, 0, blockObject);
      } else if (lastOperation.type === 'duplicate') {
        this.deleteBlock(lastOperation.blockID, false, true);
      }
    },
    cancelBulkOperations () {
      this.content = JSON.parse(this.bulkContentBackup);
      this.bulkContentBackup = '';
      this.endBulkOperations();
    },
    updateCurrentBlockID (blockID) {
      if (this.internal.currentBlockID !== blockID) {
        let id = this.internal.currentBlockID;

        if (this.$refs['block-' + id] && this.$refs['block-' + id][0]) {
          this.$refs['block-' + id][0].save();
        }

        this.internal.currentBlockID = blockID;
      }
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$off('block-editor-move-block-down', this.moveBlockDown);
    this.$bus.$off('block-editor-save-block', this.saveBlock);
    this.$bus.$off('block-editor-delete-block', this.deleteBlock);
    this.$bus.$off('block-editor-duplicate-block', this.duplicateBlock);
    this.$bus.$off('block-editor-add-block', this.addNewBlock);
    this.$bus.$off('block-editor-merge-paragraphs', this.mergeParagraphs);
    this.$bus.$off('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
    this.$bus.$off('block-editor-ui-opened-for-block', this.uiOpenedForBlock);
    this.$bus.$off('block-editor-ui-closed-for-block', this.uiClosedForBlock);
    this.$bus.$off('block-editor-convert-block', this.convertBlock);
    this.$bus.$off('publii-block-editor-save', this.saveAllBlocks);
    this.$bus.$off('publii-block-editor-load', this.loadAllBlocks);
    this.$bus.$off('publii-block-editor-update-current-block-id', this.updateCurrentBlockID);
  }
}
</script>

<style lang="scss">
@import '../assets/variables.scss';
@import '../assets/typography.scss';
@import '../assets/prism-theme.scss';

.editor {
  min-height: 100%;
  padding: 0 0 50px 0;
  position: relative;
  width: 100%;

  &-inner {
    margin: 0 auto;

    &-trigger {
      height: 100%;
      left: 50%;
      min-height: 100px;
      position: relative;
      top: 0;
      transform: translateX(-50%);
      width: $editor-width;
      z-index: 0;
    }
  }

  // UI animations
  .block-editor-ui-fade-enter-active {
    transition: opacity .2s ease;
    transition-delay: .3s;
  }
  .block-editor-ui-fade-leave-active {
    transition: opacity .2s ease;
  }
  .block-editor-ui-fade-enter,
  .block-editor-ui-fade-leave-to {
    opacity: 0;
  }

  // Bulk operations bar
  .bulk-operations-bar {
    align-items: center;
    bottom: -100px;
    display: flex;
    height: 100px;
    justify-content: center;
    left: 0;
    position: fixed;
    opacity: 0;
    transition: all .25s ease-out;
    width: 100%;
    z-index: 1000;

    &.is-visible {
      bottom: 0;
      opacity: 1;
    }

    & > button {
      background: transparent;
      box-shadow: inset 0 0 0 2px #ddd;
      border: none;
      border-radius: 3px;
      color: $block-editor-color-text;
      display: inline-block;
      font-size: 15px;
      font-weight: 500;
      padding: 13px 26px;
      position: relative;
      transition: all .25s ease-out;
      user-select: none;
      white-space: nowrap;

      &:hover {
         box-shadow: inset 0 0 0 2px #aaa;
      }

      & > svg {
         margin-right: 8px;
         vertical-align: middle;
      }
    }
  }
}
</style>
