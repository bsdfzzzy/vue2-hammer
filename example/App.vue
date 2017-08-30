<template>
  <div id="app-content"
    v-hammer:tap="test"
    v-hammer:pan="test"
    v-hammer-options:pan="{ direction: 'up', threshold: 100 }"
    v-hammer:press="test"
    v-hammer:swipe="test"
    v-hammer-options:swipe="{ direction: 'horizontal' }"
    v-hammer:pinch="test"
    v-hammer:rotate="test"
    v-hammer:doubletap="test"
  >
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    test: function (e) {
      console.log(e)
    }
  },
}
</script>