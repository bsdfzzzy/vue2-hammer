import Vue from 'vue'
import { VueHammer } from 'vue2-hammer'
import App from './App.vue'

//use the plugin
Vue.use(VueHammer)

new Vue({
  el: '#app',
  data: {
    event: ''
  },
  render: h => h(App)
})
