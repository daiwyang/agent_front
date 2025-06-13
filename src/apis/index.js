import request from './request.js';

// 用户相关API
const userApi = {
  // 用户登录
  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data,
    });
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/user/info',
      method: 'get',
    });
  },

  // 用户注册
  register(data) {
    return request({
      url: '/user/register',
      method: 'post',
      data,
    });
  },
};

// 通用API方法
const api = {
  // GET请求
  get(url, params = {}) {
    return request({
      url,
      method: 'get',
      params,
    });
  },

  // POST请求
  post(url, data = {}) {
    return request({
      url,
      method: 'post',
      data,
    });
  },

  // PUT请求
  put(url, data = {}) {
    return request({
      url,
      method: 'put',
      data,
    });
  },

  // DELETE请求
  delete(url, params = {}) {
    return request({
      url,
      method: 'delete',
      params,
    });
  },
};

// 文件上传相关API
const uploadApi = {
  // 通用文件上传
  upload(file, onProgress) {
    return new Promise((resolve, reject) => {
      // 模拟上传延迟
      const uploadTime = Math.random() * 2000 + 1000; // 1-3秒随机延迟
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        
        if (onProgress) {
          onProgress(Math.round(progress));
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // 模拟偶尔失败
          if (Math.random() < 0.1) { // 10% 失败率
            reject(new Error('上传失败：网络错误'));
            return;
          }
          
          // 成功响应
          resolve({
            success: true,
            message: '文件上传成功',
            data: {
              filename: file.name,
              url: `/uploads/${Date.now()}_${file.name}`,
              size: file.size,
              type: file.type,
              uploadTime: new Date().toISOString()
            }
          });
        }
      }, uploadTime / 10);
    });
  },

  // 图片上传
  uploadImage(file, onProgress) {
    return this.upload(file, onProgress);
  },

  // 文档上传
  uploadDocument(file, onProgress) {
    return this.upload(file, onProgress);
  }
};

// 导出默认的request实例，以便直接使用
export { api, userApi, request, uploadApi };
export default request;
