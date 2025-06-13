import request from './request.js';

// 用户相关API
export const userApi = {
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
export const api = {
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

// 导出默认的request实例，以便直接使用
export { request };
export default request;
