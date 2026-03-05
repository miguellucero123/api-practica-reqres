<template>
  <div id="app">
    <ReqresExample />
  </div>
</template>

<script>
import ReqresExample from './components/ReqresExample.vue'

export default {
  name: 'App',
  components: {
    ReqresExample
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

#app {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
  min-height: 100vh;
}
</style>
