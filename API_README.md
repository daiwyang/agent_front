# API请求配置说明

## 概述

项目已成功引入axios作为HTTP请求库，并进行了完整的配置。

## 文件结构

```txt
src/
  apis/
    ├── request.js     # axios实例配置，包含拦截器
    └── index.js       # API接口封装
  components/
    └── ApiDemo.vue    # API使用示例组件
  main.js              # 全局API配置
```

## 主要功能

### 1. request.js - 请求配置

- **基础配置**: 设置baseURL、timeout、默认headers
- **请求拦截器**: 自动添加token认证
- **响应拦截器**: 统一处理响应数据和错误

### 2. index.js - API封装

- **用户API**: userApi.login(), userApi.getUserInfo(), userApi.register()
- **通用方法**: api.get(), api.post(), api.put(), api.delete()

### 3. 全局使用

在main.js中已将API方法挂载到全局属性：

- `this.$api` - 通用API方法
- `this.$userApi` - 用户相关API
- `this.$request` - 原始axios实例

## 使用方式

### 1. 组合式API (推荐)

```javascript
import { api, userApi } from '@/apis/index.js'

// 在setup()中使用
const handleRequest = async () => {
  try {
    const data = await api.get('/endpoint')
    console.log(data)
  } catch (error) {
    console.error('请求失败:', error.message)
  }
}
```

### 2. 选项式API

```javascript
export default {
  methods: {
    async handleRequest() {
      try {
        const data = await this.$api.get('/endpoint')
        console.log(data)
      } catch (error) {
        console.error('请求失败:', error.message)
      }
    }
  }
}
```

## 配置说明

### 环境配置

- 开发环境: baseURL设置为'/api'，需要配置代理
- 生产环境: 替换为实际的API域名

### 认证处理

- 自动从localStorage读取token
- 请求头自动添加Authorization

### 错误处理

- 自动处理常见HTTP状态码
- 统一的错误消息格式
- 401错误自动清除token

## 代理配置 (开发环境)

在vite.config.js中配置代理：

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

## 示例

查看 `src/components/ApiDemo.vue` 了解完整的使用示例。
