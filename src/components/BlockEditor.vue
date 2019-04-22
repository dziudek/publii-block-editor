<template>
  <div class="editor">
    <div class="editor-inner" :style="'width: ' + contentWidth + 'px;'">
      <block-wrapper
        v-for="block of content"
        :id="block.id"
        :key="'block-wrapper-' + block.id">
        <component
          :is="block.type"
          :id="block.id"
          :config="block.config"
          :content="block.content"
          :key="'block-' + block.id" />
      </block-wrapper>
    </div>
  </div>
</template>

<script>
// core elements
import BlockWrapper from './BlockWrapper.vue';
// default blocks
import PubliiHeader from './default-blocks/Header.vue';
import PubliiList from './default-blocks/List.vue';
import PubliiParagraph from './default-blocks/Paragraph.vue';

export default {
  name: 'BlockEditor',
  components: {
    'block-wrapper': BlockWrapper,
    'publii-header': PubliiHeader,
    'publii-list': PubliiList,
    'publii-paragraph': PubliiParagraph
  },
  data () {
    return {
      content: [
        {
          id: 1555941441671,
          type: 'publii-header',
          content: 'Lorem ipsum dolor',
          config: {}
        },
        {
          id: 1555941453146,
          type: 'publii-list',
          content: '<li></li>',
          config: {}
        },
        {
          id: 1555941466744,
          type: 'publii-paragraph',
          content: 'Nulla vitae elit libero, a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Maecenas sed diam eget risus varius blandit sit amet non magna.',
          config: {}
        }
      ],
      contentWidth: 720
    };
  },
  mounted () {
    this.$bus.$on('block-editor-move-block-up', this.moveBlockUp);
    this.$bus.$on('block-editor-move-block-down', this.moveBlockDown);
  },
  methods: {
    moveBlockUp (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex > 0) {
        [ this.content[blockIndex], this.content[blockIndex - 1] ] = [ this.content[blockIndex - 1], this.content[blockIndex] ];
      }
    },
    moveBlockDown (blockID) {
      let blockIndex = this.content.findIndex(el => el.id === blockID);

      if (blockIndex < this.content.length - 1) {
        [ this.content[blockIndex], this.content[blockIndex + 1] ] = [ this.content[blockIndex + 1], this.content[blockIndex] ];
      }
    }
  }
}
</script>

<style scoped lang="scss">
.editor {
  width: 100%;

  &-inner {
    margin: 0 auto;
  }
}
</style>
