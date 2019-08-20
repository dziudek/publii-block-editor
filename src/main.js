import Vue from 'vue';
import PubliiBlockEditor from './PubliiBlockEditor.vue';

// Vendor
import 'prismjs';
import 'prismjs/themes/prism.css';
import VuePrismEditor from 'vue-prism-editor';
import 'vue-prism-editor/dist/VuePrismEditor.css';

// Config
Vue.config.productionTip = false;

// Global components
Vue.component('prism-editor', VuePrismEditor);

new Vue({
  render: h => h(PubliiBlockEditor)
}).$mount('#app');
