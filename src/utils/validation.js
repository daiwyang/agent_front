import { defineRule, configure } from 'vee-validate';
import { required, email, min, max, confirmed } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

// 定义验证规则
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('confirmed', confirmed);

// 自定义密码强度验证规则
defineRule('password', (value) => {
  if (!value) return '密码是必填项';
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  
  let strength = 0;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  
  if (value.length < 6) {
    return '密码长度至少6位';
  }
  
  if (strength < 2) {
    return '密码需要包含至少两种字符类型（大写字母、小写字母、数字、特殊字符）';
  }
  
  return true;
});

// 配置中文错误消息
configure({
  generateMessage: localize('zh_CN', {
    messages: {
      required: '{field}是必填项',
      email: '请输入有效的邮箱地址',
      min: '{field}最少需要{length}个字符',
      max: '{field}最多只能{length}个字符',
      confirmed: '两次密码输入不一致',
      password: '密码格式不正确'
    },
    names: {
      name: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码'
    }
  })
});

// 密码强度计算函数
export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, text: '', class: '', width: '0%' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  // 基础分数
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 字符类型分数
  Object.values(checks).forEach(check => {
    if (check) score += 1;
  });
  
  // 返回强度信息
  if (score <= 2) {
    return { score, text: '弱', class: 'weak', width: '25%' };
  } else if (score <= 4) {
    return { score, text: '中等', class: 'medium', width: '50%' };
  } else if (score <= 6) {
    return { score, text: '强', class: 'strong', width: '75%' };
  } else {
    return { score, text: '非常强', class: 'very-strong', width: '100%' };
  }
};
