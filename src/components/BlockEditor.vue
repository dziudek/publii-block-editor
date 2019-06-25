<template>
  <div
    class="editor"
    data-ui-opened-block=""
    ref="editor-main"
    @click="$bus.$emit('block-editor-deselect-blocks')">
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
        :style="'width: ' + config.contentWidth + 'px;'"
        @click="addNewParagraphAtEnd"></div>
    </div>
  </div>
</template>

<script>
// core elements
import Vue from 'vue';
import Block from './Block.vue';
import BlockWrapper from './BlockWrapper.vue';
import ContentEditableImprovements from './helpers/ContentEditableImprovements.vue';
import { compileToFunctions } from 'vue-template-compiler';
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

export default {
  name: 'BlockEditor',
  components: {
    'block-wrapper': BlockWrapper,
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
        contentWidth: 720
      },
      state: {
        selectedBlockID: false,
        externalComponentsLoaded: false
      },
      internal: {
        lastScroll: 0
      },
      extensions: {
        shortcutManager: new ShortcutManager()
      },
      content: [
        {
          id: 1555941441671,
          type: 'publii-header',
          content: 'Lorem ipsum dolor',
          config: {}
        },
        {
          id: 1555941441622,
          type: 'publii-code',
          content: 'Lorem ipsum dolor',
          config: {}
        },
        {
          id: 1555941432000,
          type: 'publii-readmore',
          content: '',
          config: {}
        },
        /*
        {
          id: 1555941441670,
          type: 'publii-header-custom',
          content: 'CUSTOM Lorem ipsum dolor',
          config: {}
        },
        */
        {
          id: 1555941453146,
          type: 'publii-list',
          content: '<li></li>',
          config: {}
        },
        {
          id: 1555941432021,
          type: 'publii-separator',
          content: '',
          config: {}
        },
        {
          id: 1555941466744,
          type: 'publii-paragraph',
          content: 'Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Maecenas sed diam eget risus varius blandit sit amet non magna.',
          config: {}
        },
        {
          id: 1555825318231,
          type: 'publii-quote',
          content: {
            text: 'Lorem ipsum dolor',
            author: 'John Doe'
          },
          config: {}
        }
      ]
    };
  },
  watch: {
    content: {
      handler (newState) {
        this.$bus.$emit('block-editor-content-updated');
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
    this.$bus.$on('block-editor-add-block', this.addNewBlock);
    this.$bus.$on('block-editor-merge-paragraphs', this.mergeParagraphs);
    this.$bus.$on('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
    this.$bus.$on('block-editor-ui-opened-for-block', this.uiOpenedForBlock);
    this.$bus.$on('block-editor-ui-closed-for-block', this.uiClosedForBlock);
    this.initGlobals();
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

      this.scrollWindow(blockID, startBlockTop);
    },
    moveBlockDown (blockID, startBlockTop) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex < this.content.length - 1) {
        let tempBlock = JSON.parse(JSON.stringify(this.content[blockIndex]));
        Vue.set(this.content, blockIndex, this.content[blockIndex + 1]);
        Vue.set(this.content, blockIndex + 1, tempBlock);
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
    deleteBlock (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);
      this.content.splice(blockIndex, 1);
      this.state.selectedBlockID = false;

      if (blockIndex > 0) {
        this.$refs['block-' + this.content[blockIndex - 1].id][0].focus();
      }

      if (!this.content.length) {
        this.addNewBlock('publii-paragraph', false);
      }

      this.$refs['editor-main'].setAttribute('data-ui-opened-block', '');
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
      }, 0);
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
    },
    uiOpenedForBlock (blockID) {
      this.$refs['editor-main'].setAttribute('data-ui-opened-block', blockID);
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$off('block-editor-move-block-down', this.moveBlockDown);
    this.$bus.$off('block-editor-save-block', this.saveBlock);
    this.$bus.$off('block-editor-delete-block', this.deleteBlock);
    this.$bus.$off('block-editor-add-block', this.addNewBlock);
    this.$bus.$off('block-editor-merge-paragraphs', this.mergeParagraphs);
    this.$bus.$off('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
    this.$bus.$off('block-editor-ui-opened-for-block', this.uiOpenedForBlock);
    this.$bus.$off('block-editor-ui-closed-for-block', this.uiClosedForBlock);
  }
}
</script>

<style lang="scss">
.editor {
  padding: 50px 0;
  position: relative;
  width: 100%;

  &-inner {
    margin: 0 auto;

    &-trigger {
      height: 100%;
      left: 50%;
      min-height: 100vh;
      position: absolute;
      top: 0;
      transform: translateX(-50%);
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
}
</style>
