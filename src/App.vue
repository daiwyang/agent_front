<template>
  <div id="app">
    <div class="container">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      
      <!-- HelloWorld组件示例 -->
      <HelloWorld message="Vue3 + Vite 开发环境">
        <p>这是通过插槽传递的内容</p>
      </HelloWorld>
      
      <div class="counter-section">
        <p>计数器: {{ count }}</p>
        <button @click="increment" class="btn">增加</button>
        <button @click="decrement" class="btn">减少</button>
        <button @click="reset" class="btn btn-secondary">重置</button>
      </div>
      <div class="input-section">
        <input 
          v-model="message" 
          placeholder="输入消息..."
          class="input-field"
        />
        <p v-if="message">你输入的是: {{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  setup() {
    const title = ref('Agent Front - Vue3')
    const description = ref('欢迎使用 Vue3 驱动的 Agent Front 前端项目')
    const count = ref(0)
    const message = ref('')

    const increment = () => {
      count.value++
    }

    const decrement = () => {
      count.value--
    }

    const reset = () => {
      count.value = 0
    }

    return {
      title,
      description,
      count,
      message,
      increment,
      decrement,
      reset
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

h1 {
  color: #42b883;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
}

p {
  text-align: center;
  font-size: 1.2em;
  color: #666;
  margin-bottom: 30px;
}

.counter-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.input-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn:hover {
  background: #369870;
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: #42b883;
}
</style>
