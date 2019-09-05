<template>
  <div id="publii-block-editor">
    <block-editor ref="block-editor" />
  </div>
</template>

<script>
import Vue from 'vue';
import BlockEditor from './components/BlockEditor.vue';
import Rangy from 'rangy-updated';
import 'rangy-updated/lib/rangy-selectionsaverestore.js';
import 'rangy-updated/lib/rangy-classapplier.js';
import 'rangy-updated/lib/rangy-highlighter.js';

if (!Vue.prototype.$bus) {
  if (window.app && window.app.$bus) {
    Vue.prototype.$bus = window.app.$bus;
  } else {
    Vue.prototype.$bus = new Vue();
  }
}

if (!Vue.prototype.$rangy) {
  Vue.prototype.$rangy = Rangy;
}

export default {
  name: 'publii-block-editor',
  components: {
    BlockEditor
  },
  computed: {
    isInsidePublii () {
      return !!window.process;
    }
  },
  mounted () {
    window.publiiBlockEditorInstance = this;

    if (!Vue.prototype.$highlighter) {
      Vue.prototype.$highlighter = this.$rangy.createHighlighter();
    }

    this.$highlighter.addClassApplier(this.$rangy.createClassApplier('is-highlighted', {
      ignoreWhiteSpace: true,
      tagNames: ['span', 'a']
    }));

    if (this.isInsidePublii) {
      const { ipcRenderer } = require('electron');
      ipcRenderer.on('set-post-id', this.setPostID);
    }
  },
  methods: {
    setPostID (postID) {
      console.log('POST ID SET TO:', postID);
      this.$refs['block-editor'].setPostID(postID);
    }
  }
}
</script>
