<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          Agent Front
        </router-link>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/api-demo" class="nav-link">API演示</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </div>
        
        <!-- 用户信息和设置 -->
        <div class="nav-actions">
          <!-- 主题切换按钮 -->
          <button @click="settingsStore.toggleTheme" class="theme-toggle">
            <span v-if="settingsStore.theme === 'light'">🌙</span>
            <span v-else>☀️</span>
          </button>
          
          <!-- 用户区域 -->
          <div class="user-area">
            <div v-if="userStore.isLoggedIn" class="user-info">
              <img :src="userStore.userAvatar" :alt="userStore.displayName" class="user-avatar">
              <span class="user-name">{{ userStore.displayName }}</span>
              <button @click="handleLogout" class="logout-btn">退出</button>
            </div>
            <button v-else @click="showLoginModal = true" class="login-btn">
              登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Agent Front. 基于 Vue3 + Vue Router + Pinia 构建</p>
      </div>
    </footer>

    <!-- 登录模态框 -->
    <div v-if="showLoginModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isRegisterMode ? '注册' : '登录' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="handleAuth" class="auth-form">
          <div v-if="isRegisterMode" class="form-group">
            <label for="name">姓名</label>
            <input 
              id="name"
              v-model="authForm.name" 
              type="text" 
              placeholder="请输入姓名"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input 
              id="email"
              v-model="authForm.username" 
              type="email" 
              placeholder="请输入邮箱"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="authForm.password" 
              type="password" 
              placeholder="请输入密码"
              required
            >
          </div>
          
          <div v-if="userStore.error" class="error-message">
            {{ userStore.error }}
          </div>
          
          <button type="submit" :disabled="userStore.loading" class="auth-submit-btn">
            {{ userStore.loading ? '处理中...' : (isRegisterMode ? '注册' : '登录') }}
          </button>
          
          <div class="auth-switch">
            <span v-if="!isRegisterMode">
              还没有账号？
              <button type="button" @click="isRegisterMode = true" class="switch-btn">
                立即注册
              </button>
            </span>
            <span v-else>
              已有账号？
              <button type="button" @click="isRegisterMode = false" class="switch-btn">
                立即登录
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from './stores/user.js'
import { useSettingsStore } from './stores/settings.js'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()
    const settingsStore = useSettingsStore()
    
    // 模态框状态
    const showLoginModal = ref(false)
    const isRegisterMode = ref(false)
    
    // 表单数据
    const authForm = ref({
      name: '',
      username: '',
      password: ''
    })
    
    // 处理认证（登录/注册）
    const handleAuth = async () => {
      try {
        if (isRegisterMode.value) {
          await userStore.register({
            name: authForm.value.name,
            email: authForm.value.username,
            password: authForm.value.password
          })
        } else {
          await userStore.login({
            username: authForm.value.username,
            password: authForm.value.password
          })
        }
        
        // 成功后关闭模态框
        closeModal()
      } catch (error) {
        // 错误已经在store中处理
        console.error('Auth error:', error)
      }
    }
    
    // 登出
    const handleLogout = () => {
      userStore.logout()
    }
    
    // 关闭模态框
    const closeModal = () => {
      showLoginModal.value = false
      isRegisterMode.value = false
      userStore.clearError()
      
      // 重置表单
      authForm.value = {
        name: '',
        username: '',
        password: ''
      }
    }
    
    return {
      userStore,
      settingsStore,
      showLoginModal,
      isRegisterMode,
      authForm,
      handleAuth,
      handleLogout,
      closeModal
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

/* 导航栏样式 */
.navbar {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-logo {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.nav-logo:hover {
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.user-area {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  color: white;
  font-weight: 500;
}

.login-btn, .logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.login-btn:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px 0;
  min-height: calc(100vh - 120px);
}

/* 页脚样式 */
.footer {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  text-align: center;
  padding: 20px 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9em;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 20px 40px var(--shadow);
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary);
}

.auth-form {
  padding: 0 20px 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-primary);
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.auth-submit-btn {
  width: 100%;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.auth-submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.auth-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-switch {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.switch-btn:hover {
  color: var(--accent-hover);
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }
  
  .nav-menu {
    gap: 15px;
    margin: 10px 0;
  }
  
  .nav-actions {
    margin-top: 10px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.9em;
  }
  
  .main-content {
    min-height: calc(100vh - 160px);
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-logo {
    font-size: 1.3em;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>
