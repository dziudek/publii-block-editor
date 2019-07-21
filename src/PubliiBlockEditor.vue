<template>
  <div id="publii-block-editor">
    <block-editor />
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
  Vue.prototype.$bus = new Vue();
}

if (!Vue.prototype.$rangy) {
  Vue.prototype.$rangy = Rangy;
}

export default {
  name: 'publii-block-editor',
  components: {
    BlockEditor
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
  }
}
</script>
