<template>
  <div id="app">
    <block-editor />
  </div>
</template>

<script>
import Vue from 'vue';
import BlockEditor from './components/BlockEditor.vue';
import Rangy from 'rangy-updated';
import 'rangy-updated/lib/rangy-selectionsaverestore.js';

// Declare event bus
Vue.prototype.$bus = new Vue();
Vue.prototype.$rangy = Rangy;

export default {
  name: 'app',
  components: {
    BlockEditor
  },
  mounted () {
    window.publiiBlockEditorInstance = this;
  }
}
</script>

<style lang="scss">
@import './assets/variables.scss';

*,
*:after,
*:before {
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  ::selection {
    background: $block-editor-color-gradient-end;
  }
}
</style>
