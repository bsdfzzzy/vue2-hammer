<template>
  <div id="app-content"
    v-hammer:pan="test"
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
    test(e) {
      console.log(e)
    }
  },
}
</script>