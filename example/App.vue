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
      :disabled="disable"
      v-hammer:press="test2"
      v-hammer:tap="test"
      v-hammer:pan.left="test"
      v-hammer:panstart="test2"
      v-hammer:panend="test2"
    >
    </div>
    <button @click="toggleDisableState">{{ disable ? 'Enable' : 'Disable' }} Tap</button>
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
      msg: 'Welcome to Your Vue.js App',
    disable: false
    };
  },
  methods: {
    test(e) {
      console.log(e);
    },
    test2(e) {
      console.log('aaaa');
    },
    toggleDisableState() {
      this.disable = !this.disable
    }
  }
};
</script>