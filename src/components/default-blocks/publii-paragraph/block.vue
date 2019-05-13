<template>
  <p
    class="publii-block-paragraph"
    :style="'text-align: ' + config.textAlign + ';'"
    ref="block"
    slot="block"
    @keyup="getFocusFromTab"
    @paste="pastePlainText"
    contenteditable="true"
    v-html="content">
    <portal :to="'ui-top-menu-' + id" :key="'top-menu-' + initID + '-' + lastUpdate">
      <div class="wrapper-ui-top-menu" @click.stop>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': config.textAlign === 'left' }"
          @click.stop="alignText('left')">«</button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': config.textAlign === 'center' }"
          @click.stop="alignText('center')">=</button>
        <button
          :class="{ 'wrapper-ui-top-menu-button': true, 'is-active': config.textAlign === 'right' }"
          @click.stop="alignText('right')">»</button>
      </div>
    </portal>
  </p>
</template>

<script>
import Vue from 'vue';
import Block from './../../Block.vue';
import ContentEditableImprovements from './../../helpers/ContentEditableImprovements.vue';

export default {
  name: 'Paragraph',
  mixins: [
    Block,
    ContentEditableImprovements
  ],
  data () {
    return {
      lastUpdate: +new Date(),
      initID: 0,
      config: {
        textAlign: 'left'
      },
      content: ''
    };
  },
  mounted () {
    this.content = this.inputContent;
    this.initID = Math.floor(Math.random() * (999999 - 100001)) + 100000;
    this.$refs['block'].addEventListener('keydown', this.handleEnterKey);
  },
  methods: {
    handleEnterKey (e) {
      if (e.code === 'Enter' && e.shiftKey === false) {
        let newElementName = this.$parent.$parent.extensions.shortcutManager.checkContentForShortcuts(this.$refs['block'].innerHTML);
        this.$bus.$emit('block-editor-add-block', newElementName, this.id);

        if (newElementName !== 'publii-paragraph') {
          this.$bus.$emit('block-editor-delete-block', this.id);
        }

        e.returnValue = false;
      }
    },
    alignText (position) {
      Vue.set(this.config, 'textAlign', position);
      this.lastUpdate = +new Date();
    },
    save () {
      this.content = this.$refs['block'].innerHTML;

      this.$bus.$emit('block-editor-save-block', {
        id: this.id,
        config: JSON.parse(JSON.stringify(this.config)),
        content: this.content
      });
    }
  },
  beforeDestroy () {
    this.$refs['block'].removeEventListener('keydown', this.handleEnterKey);
  }
}
</script>

<style lang="scss">
.publii-block-paragraph {
  outline: none;

  &:empty {
    &:before {
      content: 'Enter text';
      opacity: .35;
    }
  }
}
</style>
