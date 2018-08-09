import Vue from 'vue'
import {
  VueHammer
} from '../index.min'
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