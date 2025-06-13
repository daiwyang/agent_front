import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userApi } from '../apis/index.js';

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref(null);
  const isLoggedIn = ref(false);
  const loading = ref(false);
  const error = ref('');

  // 计算属性
  const displayName = computed(() => {
    return currentUser.value?.name || currentUser.value?.username || 'Guest';
  });

  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin';
  });

  const userAvatar = computed(() => {
    return (
      currentUser.value?.avatar ||
      'https://via.placeholder.com/40/42b883/ffffff?text=' + (displayName.value.charAt(0) || 'U')
    );
  });

  // 操作方法
  const login = async (credentials) => {
    loading.value = true;
    error.value = '';

    try {
      const response = await userApi.login(credentials);

      // 模拟成功响应
      const mockUser = {
        id: 1,
        username: credentials.username,
        name: credentials.username.split('@')[0], // 从邮箱提取用户名
        email: credentials.username,
        role: 'user',
        avatar: null,
        token: 'mock-jwt-token-' + Date.now(),
      };

      currentUser.value = mockUser;
      isLoggedIn.value = true;

      // 保存token到localStorage
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return mockUser;
    } catch (err) {
      error.value = err.message || '登录失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    currentUser.value = null;
    isLoggedIn.value = false;
    error.value = '';

    // 清除localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = '';

    try {
      const response = await userApi.register(userData);

      // 模拟成功响应
      const mockUser = {
        id: Date.now(),
        username: userData.email,
        name: userData.name,
        email: userData.email,
        role: 'user',
        avatar: null,
        token: 'mock-jwt-token-' + Date.now(),
      };

      currentUser.value = mockUser;
      isLoggedIn.value = true;

      // 保存token到localStorage
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return mockUser;
    } catch (err) {
      error.value = err.message || '注册失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = (profileData) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...profileData };
      localStorage.setItem('user', JSON.stringify(currentUser.value));
    }
  };

  const initializeFromStorage = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        currentUser.value = user;
        isLoggedIn.value = true;
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
        logout(); // 清除无效数据
      }
    }
  };

  const clearError = () => {
    error.value = '';
  };

  return {
    // 状态
    currentUser,
    isLoggedIn,
    loading,
    error,

    // 计算属性
    displayName,
    isAdmin,
    userAvatar,

    // 方法
    login,
    logout,
    register,
    updateProfile,
    initializeFromStorage,
    clearError,
  };
});
