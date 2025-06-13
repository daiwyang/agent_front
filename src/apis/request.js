import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://your-api-domain.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
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

    // 通常API会返回统一格式，可以在这里处理
    const { data, code, message } = response.data;

    if (code === 200 || code === 0) {
      return data;
    } else {
      // 处理业务错误
      console.error('业务错误:', message);
      return Promise.reject(new Error(message || '请求失败'));
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error);

    // 处理HTTP错误状态码
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          console.error('未授权，请重新登录');
          // 可以在这里清除token并跳转到登录页
          localStorage.removeItem('token');
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
