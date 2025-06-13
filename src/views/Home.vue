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
          <h3>Pinia计数器演示</h3>
          <p>计数器: {{ counterStore.count }}</p>
          <p v-if="counterStore.doubleCount">双倍值: {{ counterStore.doubleCount }}</p>
          <p class="counter-status">
            状态: {{ counterStore.isEven ? '偶数' : '奇数' }}
            {{ counterStore.isPositive ? ' | 正数' : counterStore.isNegative ? ' | 负数' : ' | 零' }}
          </p>
          <div class="button-group">
            <button @click="counterStore.increment()" class="btn">+1</button>
            <button @click="counterStore.increment(5)" class="btn">+5</button>
            <button @click="counterStore.decrement()" class="btn">-1</button>
            <button @click="counterStore.reset()" class="btn btn-secondary">重置</button>
          </div>
          <div class="button-group" style="margin-top: 10px;">
            <button @click="counterStore.multiply(2)" class="btn btn-small">×2</button>
            <button @click="counterStore.random(1, 100)" class="btn btn-small">随机</button>
            <button @click="counterStore.undo()" class="btn btn-small"
              :disabled="counterStore.historySize === 0">撤销</button>
          </div>

          <!-- 操作历史 -->
          <div v-if="counterStore.historySize > 0" class="history-section">
            <h4>操作历史 ({{ counterStore.historySize }})</h4>
            <div class="history-list">
              <div v-for="item in counterStore.history.slice(0, 3)" :key="item.id" class="history-item">
                <span class="history-action">{{ item.action }}</span>
                <span class="history-change">{{ item.oldValue }} → {{ item.newValue }}</span>
              </div>
              <button v-if="counterStore.historySize > 3" @click="showAllHistory = !showAllHistory"
                class="btn btn-small">
                {{ showAllHistory ? '收起' : `查看全部 ${counterStore.historySize} 条` }}
              </button>
            </div>
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
        <router-link to="/upload-demo" class="nav-card">
          <h4>📁 文件上传</h4>
          <p>体验文件上传功能</p>
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
import { useCounterStore } from '../stores/counter.js'
import { useUserStore } from '../stores/user.js'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup() {
    const title = ref('Agent Front - Vue3')
    const description = ref('欢迎使用 Vue3 + Vue Router + Pinia 驱动的前端项目')
    const message = ref('')
    const showAllHistory = ref(false)

    // 使用Pinia stores
    const counterStore = useCounterStore()
    const userStore = useUserStore()

    return {
      title,
      description,
      message,
      showAllHistory,
      counterStore,
      userStore
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
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: var(--accent-color);
  margin-bottom: 20px;
  text-align: center;
}

.counter-section {
  text-align: center;
}

.counter-section p {
  font-size: 1.5em;
  color: var(--text-primary);
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
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.message-display {
  color: var(--text-primary);
  font-weight: 500;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  border-left: 4px solid var(--accent-color);
}

.btn {
  background: var(--accent-color);
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
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.counter-status {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin: 10px 0;
}

.history-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.history-section h4 {
  margin: 0 0 10px 0;
  font-size: 1em;
  color: var(--text-secondary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.85em;
}

.history-action {
  color: var(--text-primary);
  font-weight: 500;
}

.history-change {
  color: var(--text-secondary);
  font-family: monospace;
}

.navigation-section {
  margin-top: 60px;
  text-align: center;
}

.navigation-section h3 {
  color: var(--text-primary);
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
  background: var(--bg-secondary);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px var(--shadow);
  border-color: var(--accent-color);
}

.nav-card h4 {
  color: var(--accent-color);
  margin-bottom: 10px;
  font-size: 1.3em;
}

.nav-card p {
  color: var(--text-secondary);
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
