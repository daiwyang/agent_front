<template>
  <div class="api-demo-page">
    <div class="page-header">
      <h1>API演示中心</h1>
      <p>这里展示了各种API请求的示例和用法</p>
    </div>

    <div class="demo-container">
      <!-- 原有的API演示组件 -->
      <ApiDemo />

      <!-- 额外的API信息卡片 -->
      <div class="info-cards">
        <div class="info-card">
          <h3>🔧 支持的请求类型</h3>
          <ul>
            <li>GET - 获取数据</li>
            <li>POST - 提交数据</li>
            <li>PUT - 更新数据</li>
            <li>DELETE - 删除数据</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>📋 功能特性</h3>
          <ul>
            <li>请求拦截器</li>
            <li>响应拦截器</li>
            <li>错误处理</li>
            <li>超时设置</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>🚀 快速开始</h3>
          <p>点击上方按钮体验各种API请求，查看返回的数据格式和状态。</p>
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
import ApiDemo from '../components/ApiDemo.vue'

export default {
  name: 'ApiDemoPage',
  components: {
    ApiDemo
  }
}
</script>

<style scoped>
.api-demo-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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

.demo-container {
  margin: 40px 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.info-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.info-card h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 8px 0;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 20px;
}

.info-card li:last-child {
  border-bottom: none;
}

.info-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #42b883;
  font-weight: bold;
}

.info-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
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

  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
