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

    <div class="navigation-section">
      <h3>功能导航</h3>
      <div class="nav-cards">
        <router-link v-if="!userStore.isLoggedIn" to="/login" class="nav-card">
          <h4>🔐 用户登录</h4>
          <p>登录或注册新账户</p>
        </router-link>
      </div>
    </div>

    <!-- 用户状态区域 -->
    <div v-if="userStore.isLoggedIn" class="user-status-section">
      <div class="user-welcome">
        <h3>欢迎回来，{{ userStore.displayName }}！</h3>
        <p>您已成功登录系统</p>
        <div class="user-actions">
          <button @click="testAuthAPI" class="btn btn-primary">测试认证API</button>
          <button @click="userStore.logout" class="btn btn-secondary">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'
import { useUserStore } from '../stores/user.js'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  setup() {
    const title = ref('Agent Front - Vue3')
    const description = ref('欢迎使用 Vue3 + Vue Router + Pinia 驱动的前端项目')

    // 使用Pinia stores
    const userStore = useUserStore()

    // 测试认证API的方法
    const testAuthAPI = async () => {
      try {
        // 这里调用一个需要认证的API
        const response = await fetch('http://127.0.0.1:8000/user/info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          throw new Error('Token已过期或无效');
        }
        
        const data = await response.json();
        alert('API调用成功！用户信息: ' + JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('API调用失败:', error);
        alert('API调用失败: ' + error.message);
      }
    };

    return {
      title,
      description,
      userStore,
      testAuthAPI
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
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.navigation-section {
  margin-top: 60px;
  text-align: center;
  max-width: 800px;
  margin: 60px auto 0 auto;
  padding: 0 20px;
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

/* 用户状态区域样式 */
.user-status-section {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.user-welcome {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.user-welcome h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-welcome p {
  margin: 0 0 24px 0;
  opacity: 0.9;
  font-size: 16px;
}

.user-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.user-actions .btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.user-actions .btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.user-actions .btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.user-actions .btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-actions .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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
