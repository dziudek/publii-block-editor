import Vue from 'vue'
import PubliiBlockEditor from './PubliiBlockEditor.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(PubliiBlockEditor)
}).$mount('#app')
