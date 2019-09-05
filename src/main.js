import Vue from 'vue';
import PubliiBlockEditor from './PubliiBlockEditor.vue';

// Vendor
import 'prismjs';
import VuePrismEditor from 'vue-prism-editor';
import 'vue-prism-editor/dist/VuePrismEditor.css';

// Prism JS languages
import 'prismjs/components/prism-markup-templating.min.js';
import 'prismjs/components/prism-apacheconf.min.js';
import 'prismjs/components/prism-aspnet.min.js';
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-basic.min.js';
import 'prismjs/components/prism-batch.min.js';
import 'prismjs/components/prism-c.min.js';
import 'prismjs/components/prism-cpp.min.js';
import 'prismjs/components/prism-csharp.min.js';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-dart.min.js';
import 'prismjs/components/prism-docker.min.js';
import 'prismjs/components/prism-elm.min.js';
import 'prismjs/components/prism-git.min.js';
import 'prismjs/components/prism-glsl.min.js';
import 'prismjs/components/prism-go.min.js';
import 'prismjs/components/prism-graphql.min.js';
import 'prismjs/components/prism-haml.min.js';
import 'prismjs/components/prism-handlebars.min.js';
import 'prismjs/components/prism-haskell.min.js';
import 'prismjs/components/prism-http.min.js';
import 'prismjs/components/prism-ini.min.js';
import 'prismjs/components/prism-java.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-jsonp.min.js';
import 'prismjs/components/prism-jsx.min.js';
import 'prismjs/components/prism-kotlin.min.js';
import 'prismjs/components/prism-latex.min.js';
import 'prismjs/components/prism-less.min.js';
import 'prismjs/components/prism-lisp.min.js';
import 'prismjs/components/prism-lua.min.js';
import 'prismjs/components/prism-makefile.min.js';
import 'prismjs/components/prism-markdown.min.js';
import 'prismjs/components/prism-matlab.min.js';
import 'prismjs/components/prism-nasm.min.js';
import 'prismjs/components/prism-nginx.min.js';
import 'prismjs/components/prism-objectivec.min.js';
import 'prismjs/components/prism-pascal.min.js';
import 'prismjs/components/prism-perl.min.js';
import 'prismjs/components/prism-php.min.js';
import 'prismjs/components/prism-pug.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-r.min.js';
import 'prismjs/components/prism-regex.min.js';
import 'prismjs/components/prism-ruby.min.js';
import 'prismjs/components/prism-sass.min.js';
import 'prismjs/components/prism-scss.min.js';
import 'prismjs/components/prism-scala.min.js';
import 'prismjs/components/prism-sql.min.js';
import 'prismjs/components/prism-swift.min.js';
import 'prismjs/components/prism-twig.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-vbnet.min.js';
import 'prismjs/components/prism-visual-basic.min.js';
import 'prismjs/components/prism-yaml.min.js';

// Config
Vue.config.productionTip = false;

// Global components
Vue.component('prism-editor', VuePrismEditor);

if (window.process) {
  const { ipcRenderer } = window.require('electron');
  Vue.prototype.$ipcRenderer = ipcRenderer;
}

new Vue({
  render: h => h(PubliiBlockEditor)
}).$mount('#app');
