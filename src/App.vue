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
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Agent Front. 基于 Vue3 + Vue Router 构建</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 导航栏样式 */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px 0;
  min-height: calc(100vh - 120px);
}

/* 页脚样式 */
.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 20px 0;
  margin-top: auto;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }
  
  .nav-menu {
    gap: 15px;
    margin-top: 10px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.9em;
  }
  
  .main-content {
    min-height: calc(100vh - 140px);
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
}
</style>
