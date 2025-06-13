<template>
  <div class="about-page">
    <div class="page-header">
      <h1>关于 Agent Front</h1>
      <p>一个现代化的Vue3前端项目</p>
    </div>

    <div class="content-grid">
      <div class="content-card">
        <h2>🚀 项目介绍</h2>
        <p>
          Agent Front 是一个基于 Vue3 + Vite + Vue Router 构建的现代化前端项目。
          它展示了Vue3的最新特性，包括Composition API、响应式系统等。
        </p>
      </div>

      <div class="content-card">
        <h2>⚡ 技术栈</h2>
        <div class="tech-stack">
          <div class="tech-item">
            <span class="tech-icon">🖖</span>
            <div>
              <strong>Vue 3</strong>
              <p>渐进式JavaScript框架</p>
            </div>
          </div>
          <div class="tech-item">
            <span class="tech-icon">⚡</span>
            <div>
              <strong>Vite</strong>
              <p>下一代前端构建工具</p>
            </div>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🛣️</span>
            <div>
              <strong>Vue Router</strong>
              <p>Vue.js官方路由管理器</p>
            </div>
          </div>
          <div class="tech-item">
            <span class="tech-icon">🍍</span>
            <div>
              <strong>Pinia</strong>
              <p>Vue3官方状态管理库</p>
            </div>
          </div>
          <div class="tech-item">
            <span class="tech-icon">📡</span>
            <div>
              <strong>Axios</strong>
              <p>基于Promise的HTTP客户端</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h2>✨ 主要功能</h2>
        <ul class="feature-list">
          <li>响应式组件设计</li>
          <li>路由导航管理</li>
          <li>Pinia状态管理</li>
          <li>API请求封装</li>
          <li>现代化UI界面</li>
          <li>主题切换功能</li>
          <li>用户认证系统</li>
          <li>移动端适配</li>
          <li>热重载开发体验</li>
        </ul>
      </div>

      <div class="content-card">
        <h2>📊 项目统计</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">3</div>
            <div class="stat-label">页面数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4+</div>
            <div class="stat-label">核心组件</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Vue3兼容</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">0</div>
            <div class="stat-label">已知Bug</div>
          </div>
        </div>
      </div>

      <div class="content-card full-width">
        <h2>🍍 Pinia 状态管理演示</h2>
        <PiniaDemo />
      </div>

      <div class="content-card full-width">
        <h2>🛠️ 开发指南</h2>
        <div class="command-section">
          <h3>常用命令</h3>
          <div class="command-list">
            <div class="command-item">
              <code>npm run dev</code>
              <span>启动开发服务器</span>
            </div>
            <div class="command-item">
              <code>npm run build</code>
              <span>构建生产版本</span>
            </div>
            <div class="command-item">
              <code>npm run preview</code>
              <span>预览生产构建</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="back-section">
      <router-link to="/" class="back-btn">
        ← 返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
import PiniaDemo from '../components/PiniaDemo.vue'

export default {
  name: 'About',
  components: {
    PiniaDemo
  }
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
  color: white;
}

.page-header p {
  font-size: 1.2em;
  opacity: 0.9;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.content-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.content-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.content-card.full-width {
  grid-column: 1 / -1;
}

.content-card h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-bottom: 2px solid #f093fb;
  padding-bottom: 10px;
}

.content-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.tech-stack {
  display: grid;
  gap: 15px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.tech-item:hover {
  background: #e9ecef;
}

.tech-icon {
  font-size: 2em;
  width: 50px;
  text-align: center;
}

.tech-item strong {
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.tech-item p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 10px 0;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 25px;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list li::before {
  content: '✨';
  position: absolute;
  left: 0;
  font-size: 1.1em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #f093fb;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

.command-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.command-list {
  display: grid;
  gap: 15px;
}

.command-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #f093fb;
}

.command-item code {
  background: #333;
  color: #f093fb;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.command-item span {
  color: #666;
  font-size: 0.9em;
}

.back-section {
  text-align: center;
  margin-top: 50px;
}

.back-btn {
  display: inline-block;
  padding: 12px 30px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.3);
}

.back-btn:hover {
  background: #369870;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .command-item {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
