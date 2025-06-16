<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h2 class="title">{{ isRegister ? '用户注册' : '用户登录' }}</h2>
          <p class="subtitle">{{ isRegister ? '创建新账户' : '欢迎回来' }}</p>
        </div>

        <Form @submit="handleSubmit" v-slot="{ errors, isSubmitting }">
          <!-- 注册时显示的额外字段 -->
          <div v-if="isRegister" class="form-group">
            <label for="name">用户名</label>
            <Field 
              name="name" 
              type="text" 
              placeholder="请输入用户名"
              class="form-input"
              :class="{ 'error': errors.name }"
              rules="required|min:2|max:20"
            />
            <ErrorMessage name="name" class="error-text" />
          </div>

          <!-- 邮箱/用户名 -->
          <div class="form-group">
            <label for="email">{{ isRegister ? '邮箱' : '用户名/邮箱' }}</label>
            <Field 
              name="email" 
              type="email" 
              placeholder="请输入邮箱地址"
              class="form-input"
              :class="{ 'error': errors.email }"
              rules="required|email"
            />
            <ErrorMessage name="email" class="error-text" />
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label for="password">密码</label>
            <Field 
              name="password" 
              type="password" 
              placeholder="请输入密码"
              class="form-input"
              :class="{ 'error': errors.password }"
              :rules="isRegister ? 'required|min:6|max:20|password' : 'required'"
              v-model="passwordValue"
            />
            <ErrorMessage name="password" class="error-text" />
            
            <!-- 密码强度指示器（仅注册时显示） -->
            <div v-if="isRegister && passwordValue" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text" :class="passwordStrength.class">
                密码强度: {{ passwordStrength.text }}
              </span>
            </div>
          </div>

          <!-- 注册时的确认密码 -->
          <div v-if="isRegister" class="form-group">
            <label for="confirmPassword">确认密码</label>
            <Field 
              name="confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
              class="form-input"
              :class="{ 'error': errors.confirmPassword }"
              rules="required|confirmed:@password"
            />
            <ErrorMessage name="confirmPassword" class="error-text" />
          </div>

          <!-- 服务器错误信息 -->
          <div v-if="userStore.error" class="server-error-message">
            <i class="error-icon">⚠️</i>
            {{ userStore.error }}
          </div>

          <!-- 成功消息 -->
          <div v-if="successMessage" class="success-message">
            <i class="success-icon">✅</i>
            {{ successMessage }}
          </div>

          <!-- 提交按钮 -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="userStore.loading || isSubmitting"
          >
            <span v-if="userStore.loading || isSubmitting" class="loading-spinner"></span>
            {{ userStore.loading || isSubmitting ? '处理中...' : (isRegister ? '注册' : '登录') }}
          </button>
        </Form>

        <!-- 切换登录/注册 -->
        <div class="switch-mode">
          <p>
            {{ isRegister ? '已有账户？' : '没有账户？' }}
            <button 
              type="button" 
              @click="toggleMode" 
              class="switch-btn"
            >
              {{ isRegister ? '立即登录' : '立即注册' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useUserStore } from '../stores/user.js';
import { handleLoginRedirect } from '../utils/auth.js';
import { calculatePasswordStrength } from '../utils/validation.js';
import '../utils/validation.js'; // 导入验证规则配置

const router = useRouter();
const userStore = useUserStore();

// 控制显示登录还是注册
const isRegister = ref(false);

// 成功消息
const successMessage = ref('');

// 密码值用于计算强度
const passwordValue = ref('');

// 计算密码强度
const passwordStrength = computed(() => {
  return calculatePasswordStrength(passwordValue.value);
});

// 清除错误信息
const clearError = () => {
  userStore.clearError();
  successMessage.value = '';
};

// 切换登录/注册模式
const toggleMode = () => {
  isRegister.value = !isRegister.value;
  passwordValue.value = '';
  clearError();
};

// 处理表单提交
const handleSubmit = async (values) => {
  try {
    clearError();

    if (isRegister.value) {
      // 注册 - 根据后端API规范调整参数格式
      try {
        const user = await userStore.register({
          username: values.name,
          email: values.email,
          password: values.password
        });
        
        // 处理注册结果
        if (userStore.isLoggedIn) {
          // 自动登录成功，直接跳转
          handleLoginRedirect();
        } else if (user === null) {
          // 注册成功但需要手动登录
          successMessage.value = '注册成功！请使用您的账户登录';
          isRegister.value = false; // 自动切换到登录表单
          values.email = values.email; // 保留邮箱
          values.password = ''; // 清空密码
        }
        
        // 如果注册成功但需要重新登录，切换到登录模式并预填信息
        isRegister.value = false;
        // 这里可以预填登录表单，但由于使用了vee-validate，需要重新处理
        
      } catch (error) {
        // 检查是否是需要重新登录的提示
        if (error.message && error.message.includes('注册成功')) {
          // 显示成功消息并切换到登录模式
          successMessage.value = '注册成功！请使用您的账户信息登录。';
          isRegister.value = false;
          
          // 3秒后清除成功消息
          setTimeout(() => {
            successMessage.value = '';
          }, 3000);
          
          return;
        }
        throw error;
      }
    } else {
      // 登录 - 使用 OAuth2 标准格式（username + password）
      await userStore.login({
        username: values.email, // 使用邮箱作为username
        password: values.password
      });
    }

    // 成功后使用重定向处理
    handleLoginRedirect();
  } catch (error) {
    console.error('提交失败:', error);
    // 错误信息已经在store中处理了
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 32px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #718096;
  margin: 0;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-text {
  display: block;
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background: #dc2626;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-fill.very-strong {
  background: #059669;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-text.weak {
  color: #dc2626;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

.strength-text.very-strong {
  color: #059669;
}

.server-error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #059669;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon,
.success-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.switch-mode {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.switch-mode p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  transition: color 0.2s ease;
}

.switch-btn:hover {
  color: #5a67d8;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-page {
    padding: 10px;
  }
  
  .login-card {
    padding: 24px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style>
