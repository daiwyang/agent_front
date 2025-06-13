import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const theme = ref('light');
  const language = ref('zh-CN');
  const notifications = ref(true);
  const sidebarCollapsed = ref(false);
  const autoSave = ref(true);

  // 初始化从localStorage加载设置
  const initializeSettings = () => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        theme.value = settings.theme || 'light';
        language.value = settings.language || 'zh-CN';
        notifications.value = settings.notifications !== undefined ? settings.notifications : true;
        sidebarCollapsed.value = settings.sidebarCollapsed || false;
        autoSave.value = settings.autoSave !== undefined ? settings.autoSave : true;
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    }

    // 应用主题
    applyTheme();
  };

  // 保存设置到localStorage
  const saveSettings = () => {
    const settings = {
      theme: theme.value,
      language: language.value,
      notifications: notifications.value,
      sidebarCollapsed: sidebarCollapsed.value,
      autoSave: autoSave.value,
    };
    localStorage.setItem('app-settings', JSON.stringify(settings));
  };

  // 应用主题
  const applyTheme = () => {
    const root = document.documentElement;
    if (theme.value === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  };

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    applyTheme();
    if (autoSave.value) {
      saveSettings();
    }
  };

  // 设置主题
  const setTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      theme.value = newTheme;
      applyTheme();
      if (autoSave.value) {
        saveSettings();
      }
    }
  };

  // 设置语言
  const setLanguage = (newLanguage) => {
    language.value = newLanguage;
    if (autoSave.value) {
      saveSettings();
    }
  };

  // 切换通知
  const toggleNotifications = () => {
    notifications.value = !notifications.value;
    if (autoSave.value) {
      saveSettings();
    }
  };

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    if (autoSave.value) {
      saveSettings();
    }
  };

  // 重置所有设置
  const resetSettings = () => {
    theme.value = 'light';
    language.value = 'zh-CN';
    notifications.value = true;
    sidebarCollapsed.value = false;
    autoSave.value = true;

    applyTheme();
    saveSettings();
  };

  // 批量更新设置
  const updateSettings = (newSettings) => {
    if (newSettings.theme !== undefined) {
      theme.value = newSettings.theme;
    }
    if (newSettings.language !== undefined) {
      language.value = newSettings.language;
    }
    if (newSettings.notifications !== undefined) {
      notifications.value = newSettings.notifications;
    }
    if (newSettings.sidebarCollapsed !== undefined) {
      sidebarCollapsed.value = newSettings.sidebarCollapsed;
    }
    if (newSettings.autoSave !== undefined) {
      autoSave.value = newSettings.autoSave;
    }

    applyTheme();
    if (autoSave.value) {
      saveSettings();
    }
  };

  // 监听设置变化，自动保存
  if (typeof window !== 'undefined') {
    watch([theme, language, notifications, sidebarCollapsed], () => {
      if (autoSave.value) {
        saveSettings();
      }
    });
  }

  return {
    // 状态
    theme,
    language,
    notifications,
    sidebarCollapsed,
    autoSave,

    // 方法
    initializeSettings,
    saveSettings,
    toggleTheme,
    setTheme,
    setLanguage,
    toggleNotifications,
    toggleSidebar,
    resetSettings,
    updateSettings,
  };
});
