<template>
  <div class="api-demo">
    <h2>API请求示例</h2>

    <div class="demo-section">
      <h3>用户登录示例</h3>
      <button @click="handleLogin" :disabled="loading">
        {{ loading ? '登录中...' : '模拟登录' }}
      </button>
    </div>

    <div class="demo-section">
      <h3>GET请求示例</h3>
      <button @click="handleGet" :disabled="loading">
        发送GET请求
      </button>
    </div>

    <div class="demo-section">
      <h3>POST请求示例</h3>
      <button @click="handlePost" :disabled="loading">
        发送POST请求
      </button>
    </div>

    <div class="result-section" v-if="result">
      <h3>请求结果：</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
// 也可以直接导入使用
import { api, userApi } from '../apis/index.js'

export default {
  name: 'ApiDemo',
  setup() {
    const loading = ref(false)
    const result = ref('')

    // 使用导入的API方法
    const handleLogin = async () => {
      loading.value = true
      try {
        const response = await userApi.login({
          username: 'demo@example.com',
          password: 'password123'
        })
        result.value = JSON.stringify(response, null, 2)
      } catch (error) {
        result.value = `登录失败: ${error.message}`
      } finally {
        loading.value = false
      }
    }

    const handleGet = async () => {
      loading.value = true
      try {
        const response = await api.get('/demo/data', { page: 1, size: 10 })
        result.value = JSON.stringify(response, null, 2)
      } catch (error) {
        result.value = `GET请求失败: ${error.message}`
      } finally {
        loading.value = false
      }
    }

    const handlePost = async () => {
      loading.value = true
      try {
        const response = await api.post('/demo/create', {
          name: '测试数据',
          type: 'demo'
        })
        result.value = JSON.stringify(response, null, 2)
      } catch (error) {
        result.value = `POST请求失败: ${error.message}`
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      result,
      handleLogin,
      handleGet,
      handlePost
    }
  }
}
</script>

<style scoped>
.api-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.demo-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  color: #333;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.result-section {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

pre {
  background: #343a40;
  color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
