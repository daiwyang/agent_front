import axios from 'axios';
import router from '../router/index.js';

// 创建axios实例
const request = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000/agent_backend'
      : 'https://your-api-domain.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');

    // 对于需要认证的请求，检查是否有token
    const isAuthRequired = !config.url.includes('/login') && !config.url.includes('/register');

    if (isAuthRequired && !token) {
      // 如果需要认证但没有token，跳转到登录页
      console.warn('未登录，跳转到登录页');
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
      return Promise.reject(new Error('未登录'));
    }

    // 添加token到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('发送请求:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('响应数据:', response);

    // 检查响应格式，适配不同的后端响应结构
    if (response.data) {
      // 如果直接返回数据对象（FastAPI默认格式）
      if (response.data.access_token || response.data.token || response.data.user || response.data.id) {
        return response.data;
      }
      
      // 如果是包装格式 {code, data, message}
      const { data, code, message } = response.data;
      if (code === 200 || code === 0) {
        return data;
      } else {
        // 处理业务错误
        console.error('业务错误:', message);
        return Promise.reject(new Error(message || '请求失败'));
      }
    }
    
    // 默认返回整个响应数据
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error);

    // 处理HTTP错误状态码
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          // 未授权，清除本地存储并跳转到登录页
          console.error('未授权，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // 只有在当前不是登录页面时才跳转
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login');
          }
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('网络错误');
      }
    } else {
      console.error('网络连接失败');
    }

    return Promise.reject(error);
  }
);

export default request;
