import { useUserStore } from '../stores/user.js';
import router from '../router/index.js';

/**
 * 检查用户是否已登录，如果未登录则跳转到登录页
 * @returns {boolean} 是否已登录
 */
export const checkAuth = () => {
  const userStore = useUserStore();
  const token = localStorage.getItem('token');
  
  if (!token || !userStore.isLoggedIn) {
    console.warn('用户未登录，跳转到登录页');
    
    // 保存当前路径，登录后可以返回
    const currentPath = router.currentRoute.value.fullPath;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectPath', currentPath);
    }
    
    router.push('/login');
    return false;
  }
  
  return true;
};

/**
 * 需要认证的API调用包装器
 * @param {Function} apiCall - API调用函数
 * @param {...any} args - API调用参数
 * @returns {Promise} API调用结果
 */
export const authApiCall = async (apiCall, ...args) => {
  if (!checkAuth()) {
    return Promise.reject(new Error('未登录'));
  }
  
  try {
    return await apiCall(...args);
  } catch (error) {
    // 如果API返回401错误，说明token可能已过期
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      checkAuth(); // 重新检查并跳转
    }
    throw error;
  }
};

/**
 * 用户登录成功后的重定向处理
 */
export const handleLoginRedirect = () => {
  const redirectPath = sessionStorage.getItem('redirectPath');
  
  if (redirectPath && redirectPath !== '/login') {
    sessionStorage.removeItem('redirectPath');
    router.push(redirectPath);
  } else {
    router.push('/');
  }
};
