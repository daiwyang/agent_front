// Pinia Store 入口文件
// 统一导出所有 store

export { useUserStore } from './user.js'
export { useSettingsStore } from './settings.js'
export { useCounterStore } from './counter.js'

// 可以在这里添加store插件或全局配置
import { useUserStore } from './user.js'
import { useSettingsStore } from './settings.js'

// 初始化应用状态的函数
export const initializeStores = () => {
  // 初始化用户状态
  const userStore = useUserStore()
  userStore.initializeFromStorage()
  
  // 初始化设置
  const settingsStore = useSettingsStore()
  settingsStore.initializeSettings()
}

// 清理所有状态的函数
export const resetAllStores = () => {
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()
  
  userStore.logout()
  settingsStore.resetSettings()
}
