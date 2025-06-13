<template>
  <div class="hello-component">
    <h2>{{ message }}</h2>
    <p>这是一个Vue3组件示例</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    message: {
      type: String,
      default: 'Hello Vue3!'
    }
  }
}
</script>

<style scoped>
.hello-component {
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}

h2 {
  color: #42b883;
  margin: 0 0 10px 0;
}
</style>
