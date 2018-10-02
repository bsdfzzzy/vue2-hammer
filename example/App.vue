<template>
  <div>
    <div
      id="app-content"
      v-hammer:swipe.horizontal="test"
    >
    </div>
    {{ msg }}
    <div
      class="content"
      v-hammer:press="test2"
      v-hammer:tap="test"
      v-hammer:pan.left="test"
      v-hammer:panstart="test2"
      v-hammer:panend="test2"
    >
    </div>
  </div>
</template>

<style>
#app-content {
  width: 300px;
  height: 200px;
  background-color: #ddd;
}
.content {
  width: 100px;
  height: 200px;
  background-color: red;
}
</style>


<script>
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  methods: {
    test(e) {
      console.log(e);
    },
    test2(e) {
      console.log('aaaa');
    }
  }
};
</script>