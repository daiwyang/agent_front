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

      // 处理登录响应 - 适配FastAPI响应格式
      if (response.access_token) {
        // FastAPI JWT Token格式
        const token = response.access_token;

        // 如果后端返回了用户信息就使用，否则需要单独获取
        if (response.user) {
          currentUser.value = response.user;
        } else {
          // 如果没有返回用户信息，设置基本信息并尝试获取完整信息
          currentUser.value = {
            username: credentials.username,
          };

          // 异步获取完整用户信息，不阻塞登录流程
          fetchUserInfo().catch((err) => {
            console.warn('Failed to fetch user info after login:', err);
          });
        }

        isLoggedIn.value = true;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser.value));

        return currentUser.value;
      } else if (response.token) {
        // 标准token格式
        currentUser.value = response.user;
        isLoggedIn.value = true;

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response.user;
      } else {
        throw new Error('登录响应格式错误');
      }
    } catch (err) {
      // 根据HTTP状态码和错误信息提供更具体的错误提示
      let errorMessage = '登录失败';

      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        switch (status) {
          case 401:
            if (
              responseData?.detail?.includes('user not found') ||
              err.message?.includes('user not found')
            ) {
              errorMessage = '用户不存在，请检查邮箱地址或先注册账户';
            } else if (
              responseData?.detail?.includes('invalid credentials') ||
              err.message?.includes('invalid credentials')
            ) {
              errorMessage = '用户名或密码错误，请重新输入';
            } else {
              errorMessage = '登录凭据无效，请检查用户名和密码';
            }
            break;
          case 422:
            errorMessage = '请求参数格式错误，请检查输入内容';
            break;
          case 500:
            errorMessage = '服务器内部错误，请稍后重试';
            break;
          default:
            errorMessage = responseData?.detail || err.message || '登录失败';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      throw new Error(errorMessage);
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

      // 处理注册响应 - 适配FastAPI响应格式
      if (response.access_token) {
        // FastAPI JWT Token格式
        const token = response.access_token;
        const user = response.user || {
          username: userData.username,
          email: userData.email,
        };

        currentUser.value = user;
        isLoggedIn.value = true;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // 注册后自动获取完整用户信息
        await fetchUserInfo();

        return currentUser.value;
      } else if (response.token) {
        // 标准token格式
        currentUser.value = response.user;
        isLoggedIn.value = true;

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response.user;
      } else if (response.id || response.username || response.email) {
        // 只返回用户信息的情况，直接设置用户状态
        currentUser.value = response;
        isLoggedIn.value = true;

        // 保存用户信息，不保存token（需要后续登录）
        localStorage.setItem('user', JSON.stringify(response));

        // 提示用户需要登录
        error.value = '注册成功！请使用您的账户信息登录';
        return null;
      } else {
        // 注册成功但响应格式不明确
        throw new Error('注册成功！请使用您的账户信息登录');
      }
    } catch (err) {
      // 根据HTTP状态码和错误信息提供更具体的错误提示
      let errorMessage = '注册失败';

      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;

        switch (status) {
          case 409:
            if (responseData?.detail?.includes('email') || responseData?.detail?.includes('邮箱')) {
              errorMessage = '该邮箱已被注册，请使用其他邮箱或直接登录';
            } else if (
              responseData?.detail?.includes('username') ||
              responseData?.detail?.includes('用户名')
            ) {
              errorMessage = '该用户名已被使用，请选择其他用户名';
            } else {
              errorMessage = '用户已存在，请使用其他信息注册';
            }
            break;
          case 422:
            errorMessage = '注册信息格式错误，请检查输入内容';
            break;
          case 400:
            errorMessage = responseData?.detail || '注册信息有误，请重新填写';
            break;
          case 500:
            errorMessage = '服务器内部错误，请稍后重试';
            break;
          default:
            errorMessage = responseData?.detail || err.message || '注册失败';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await userApi.getUserInfo();
      if (userInfo) {
        currentUser.value = { ...currentUser.value, ...userInfo };
        localStorage.setItem('user', JSON.stringify(currentUser.value));
      }
      return userInfo;
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      // 不抛出错误，因为这不是关键操作
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
    fetchUserInfo,
    updateProfile,
    initializeFromStorage,
    clearError,
  };
});
