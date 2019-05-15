<template>
  <div
    class="editor"
    @click="$bus.$emit('block-editor-deselect-blocks')">
    <div
      v-if="state.externalComponentsLoaded"
      class="editor-inner"
      :style="'width: ' + config.contentWidth + 'px;'">
      <block-wrapper
        v-for="block of content"
        :id="block.id"
        :key="'block-wrapper-' + block.id"
        :ref="'block-wrapper-' + block.id">
        <component
          :is="block.type"
          :id="block.id"
          :inputConfig="block.config"
          :inputContent="block.content"
          :key="'block-' + block.id"
          :ref="'block-' + block.id" />
      </block-wrapper>
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
import PubliiHeader from './default-blocks/publii-header/block.vue';
import PubliiList from './default-blocks/publii-list/block.vue';
import PubliiParagraph from './default-blocks/publii-paragraph/block.vue';
import PubliiReadmore from './default-blocks/publii-readmore/block.vue';
import PubliiSeparator from './default-blocks/publii-separator/block.vue';
import PubliiQuote from './default-blocks/publii-quote/block.vue';
// extensions
import ShortcutManager from './extensions/ShortcutManager.js';

export default {
  name: 'BlockEditor',
  components: {
    'block-wrapper': BlockWrapper,
    'publii-code': PubliiCode,
    'publii-header': PubliiHeader,
    'publii-list': PubliiList,
    'publii-paragraph': PubliiParagraph,
    'publii-readmore': PubliiReadmore,
    'publii-separator': PubliiSeparator,
    'publii-quote': PubliiQuote
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
            text: '',
            author: ''
          },
          config: {}
        }
      ]
    };
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
    this.$bus.$on('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$on('block-editor-move-block-down', this.moveBlockDown);
    this.$bus.$on('block-editor-save-block', this.saveBlock);
    this.$bus.$on('block-editor-delete-block', this.deleteBlock);
    this.$bus.$on('block-editor-add-block', this.addNewBlock);
    this.$bus.$on('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
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
    moveBlockUp (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex > 0) {
        let tempBlock = JSON.parse(JSON.stringify(this.content[blockIndex]));
        Vue.set(this.content, blockIndex, this.content[blockIndex - 1]);
        Vue.set(this.content, blockIndex - 1, tempBlock);
      }
    },
    moveBlockDown (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex < this.content.length - 1) {
        let tempBlock = JSON.parse(JSON.stringify(this.content[blockIndex]));
        Vue.set(this.content, blockIndex, this.content[blockIndex + 1]);
        Vue.set(this.content, blockIndex + 1, tempBlock);
      }
    },
    saveBlock (blockData) {
      let blockIndex = this.content.findIndex(el => el.id === blockData.id);
      this.content[blockIndex].content = blockData.content;
      this.content[blockIndex].config = blockData.config;
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
    },
    addNewBlock (blockType, afterBlockID = false, content = '') {
      let blockIndex = this.content.findIndex(el => el.id === afterBlockID);
      this.$bus.$emit('block-editor-deselect-blocks');

      if (!afterBlockID) {
        blockIndex = -1;
      }

      let newBlockID = +new Date();
      let newBlockObject = {
        id: newBlockID,
        type: blockType,
        content: content,
        config: {}
      };
      this.content.splice(blockIndex + 1, 0, newBlockObject);

      setTimeout(() => {
        if (content === '') {
          this.$refs['block-' + newBlockID][0].focus(true);
        } else {
          this.$refs['block-' + newBlockID][0].focus(false);
        }
      }, 0);
    }
  },
  beforeDestroy () {
    this.$bus.$off('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$off('block-editor-move-block-down', this.moveBlockDown);
    this.$bus.$off('block-editor-save-block', this.saveBlock);
    this.$bus.$off('block-editor-delete-block', this.deleteBlock);
    this.$bus.$off('block-editor-add-block', this.addNewBlock);
    this.$bus.$off('block-editor-shortcut-manager-add-shortcut', this.extensions.shortcutManager.add);
  }
}
</script>

<style scoped lang="scss">
.editor {
  padding: 50px 0;
  width: 100%;

  &-inner {
    margin: 0 auto;
  }
}
</style>
