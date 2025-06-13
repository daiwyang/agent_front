<template>
  <div class="home">
    <div class="hero-section">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>

    <!-- HelloWorld组件示例 -->
    <div class="demo-section">
      <HelloWorld message="Vue3 + Vite + Vue Router">
        <p>这是通过插槽传递的内容</p>
      </HelloWorld>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="counter-section">
          <h3>计数器演示</h3>
          <p>计数器: {{ count }}</p>
          <div class="button-group">
            <button @click="increment" class="btn">增加</button>
            <button @click="decrement" class="btn">减少</button>
            <button @click="reset" class="btn btn-secondary">重置</button>
          </div>
        </div>
      </div>

      <div class="feature-card">
        <div class="input-section">
          <h3>响应式输入</h3>
          <input v-model="message" placeholder="输入消息..." class="input-field" />
          <p v-if="message" class="message-display">你输入的是: {{ message }}</p>
        </div>
      </div>
    </div>

    <div class="navigation-section">
      <h3>探索更多功能</h3>
      <div class="nav-cards">
        <router-link to="/api-demo" class="nav-card">
          <h4>📡 API演示</h4>
          <p>查看各种API请求示例</p>
        </router-link>
        <router-link to="/about" class="nav-card">
          <h4>ℹ️ 关于项目</h4>
          <p>了解项目详细信息</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup() {
    const title = ref('Agent Front - Vue3')
    const description = ref('欢迎使用 Vue3 + Vue Router 驱动的前端项目')
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
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #42b883 0%, #369870 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(66, 184, 131, 0.3);
}

.hero-section h1 {
  font-size: 3em;
  margin-bottom: 20px;
  color: white;
}

.hero-section p {
  font-size: 1.3em;
  opacity: 0.9;
}

.demo-section {
  margin: 40px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #42b883;
  margin-bottom: 20px;
  text-align: center;
}

.counter-section {
  text-align: center;
}

.counter-section p {
  font-size: 1.5em;
  color: #333;
  margin: 20px 0;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.input-section {
  text-align: center;
}

.input-field {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.message-display {
  color: #333;
  font-weight: 500;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #42b883;
}

.btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn:hover {
  background: #369870;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
}

.navigation-section {
  margin-top: 60px;
  text-align: center;
}

.navigation-section h3 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8em;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.nav-card {
  display: block;
  text-decoration: none;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #42b883;
}

.nav-card h4 {
  color: #42b883;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.nav-card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2em;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 120px;
  }
}
</style>
