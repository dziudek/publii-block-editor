<template>
  <div id="app">
    <block-editor />
  </div>
</template>

<script>
import Vue from 'vue';
import PortalVue from 'portal-vue';
import BlockEditor from './components/BlockEditor.vue'

// Enable portals
Vue.use(PortalVue)

// Declare event bus
Vue.prototype.$bus = new Vue();

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
*,
*:after,
*:before {
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
