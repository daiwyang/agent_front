<template>
  <div class="pinia-demo">
    <h2>🍍 Pinia 状态管理演示</h2>
    
    <!-- 用户状态演示 -->
    <div class="demo-section">
      <h3>👤 用户状态管理</h3>
      <div class="user-status">
        <div v-if="userStore.isLoggedIn" class="logged-in">
          <p>✅ 已登录用户: <strong>{{ userStore.displayName }}</strong></p>
          <p>📧 邮箱: {{ userStore.currentUser?.email }}</p>
          <p>🔑 权限: {{ userStore.isAdmin ? '管理员' : '普通用户' }}</p>
          <button @click="updateProfile" class="btn">更新资料</button>
          <button @click="userStore.logout" class="btn btn-secondary">退出登录</button>
        </div>
        <div v-else class="not-logged-in">
          <p>❌ 未登录状态</p>
          <p>请点击右上角登录按钮进行登录</p>
        </div>
      </div>
    </div>

    <!-- 设置状态演示 -->
    <div class="demo-section">
      <h3>⚙️ 应用设置管理</h3>
      <div class="settings-controls">
        <div class="setting-item">
          <label>
            <strong>主题模式:</strong>
            <select v-model="settingsStore.theme" @change="settingsStore.setTheme(settingsStore.theme)">
              <option value="light">亮色主题</option>
              <option value="dark">暗色主题</option>
            </select>
          </label>
        </div>
        
        <div class="setting-item">
          <label>
            <strong>语言设置:</strong>
            <select v-model="settingsStore.language" @change="settingsStore.setLanguage(settingsStore.language)">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </label>
        </div>
        
        <div class="setting-item">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="settingsStore.notifications" 
              @change="settingsStore.toggleNotifications"
            >
            <strong>启用通知</strong>
          </label>
        </div>
        
        <div class="setting-item">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="settingsStore.autoSave" 
            >
            <strong>自动保存设置</strong>
          </label>
        </div>
        
        <button @click="settingsStore.resetSettings" class="btn btn-warning">
          重置所有设置
        </button>
      </div>
    </div>

    <!-- 计数器状态演示 -->
    <div class="demo-section">
      <h3>🔢 计数器状态管理</h3>
      <div class="counter-controls">
        <div class="counter-display">
          <div class="counter-value">{{ counterStore.count }}</div>
          <div class="counter-info">
            <span class="badge" :class="{ 'badge-success': counterStore.isEven, 'badge-warning': !counterStore.isEven }">
              {{ counterStore.isEven ? '偶数' : '奇数' }}
            </span>
            <span class="badge" :class="{ 'badge-success': counterStore.isPositive, 'badge-danger': counterStore.isNegative, 'badge-secondary': counterStore.count === 0 }">
              {{ counterStore.isPositive ? '正数' : counterStore.isNegative ? '负数' : '零' }}
            </span>
            <span class="badge badge-info">双倍值: {{ counterStore.doubleCount }}</span>
          </div>
        </div>
        
        <div class="counter-actions">
          <button @click="counterStore.increment()" class="btn">+1</button>
          <button @click="counterStore.increment(5)" class="btn">+5</button>
          <button @click="counterStore.increment(10)" class="btn">+10</button>
          <button @click="counterStore.decrement()" class="btn">-1</button>
          <button @click="counterStore.decrement(5)" class="btn">-5</button>
          <button @click="counterStore.multiply(2)" class="btn btn-info">×2</button>
          <button @click="counterStore.divide(2)" class="btn btn-info">÷2</button>
          <button @click="counterStore.power(2)" class="btn btn-info">²</button>
          <button @click="counterStore.random(1, 100)" class="btn btn-success">随机</button>
          <button @click="counterStore.reset()" class="btn btn-secondary">重置</button>
          <button @click="counterStore.undo()" class="btn btn-warning" :disabled="counterStore.historySize === 0">
            撤销 ({{ counterStore.historySize }})
          </button>
        </div>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <h4>📊 统计信息</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ counterStats.currentValue }}</div>
            <div class="stat-label">当前值</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ counterStats.totalActions }}</div>
            <div class="stat-label">总操作数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ counterStats.incrementCount }}</div>
            <div class="stat-label">增加次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ counterStats.decrementCount }}</div>
            <div class="stat-label">减少次数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作历史 -->
    <div class="demo-section" v-if="counterStore.historySize > 0">
      <h3>📝 操作历史</h3>
      <div class="history-controls">
        <button @click="counterStore.clearHistory()" class="btn btn-danger">清空历史</button>
        <span class="history-count">共 {{ counterStore.historySize }} 条记录</span>
      </div>
      
      <div class="history-timeline">
        <div 
          v-for="(item, index) in counterStore.history.slice(0, showAllHistory ? undefined : 5)" 
          :key="item.id" 
          class="history-item"
        >
          <div class="history-badge">{{ index + 1 }}</div>
          <div class="history-content">
            <div class="history-action">{{ item.action }}</div>
            <div class="history-change">{{ item.oldValue }} → {{ item.newValue }}</div>
            <div class="history-time">{{ item.timestamp }}</div>
          </div>
        </div>
        
        <button 
          v-if="counterStore.historySize > 5" 
          @click="showAllHistory = !showAllHistory" 
          class="btn btn-link"
        >
          {{ showAllHistory ? '收起' : `查看全部 ${counterStore.historySize} 条` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user.js'
import { useSettingsStore } from '../stores/settings.js'
import { useCounterStore } from '../stores/counter.js'

export default {
  name: 'PiniaDemo',
  setup() {
    const userStore = useUserStore()
    const settingsStore = useSettingsStore()
    const counterStore = useCounterStore()
    
    const showAllHistory = ref(false)
    
    // 计算统计信息
    const counterStats = computed(() => counterStore.getStats())
    
    // 更新用户资料
    const updateProfile = () => {
      userStore.updateProfile({
        name: userStore.currentUser.name + ' (已更新)'
      })
    }
    
    return {
      userStore,
      settingsStore,
      counterStore,
      showAllHistory,
      counterStats,
      updateProfile
    }
  }
}
</script>

<style scoped>
.pinia-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.pinia-demo h2 {
  color: var(--accent-color);
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
}

.demo-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px var(--shadow);
}

.demo-section h3 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.3em;
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 10px;
}

/* 用户状态样式 */
.user-status .logged-in {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 15px;
}

.user-status .not-logged-in {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 15px;
}

/* 设置控件样式 */
.settings-controls {
  display: grid;
  gap: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
}

.setting-item select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.checkbox-label {
  cursor: pointer;
}

/* 计数器样式 */
.counter-controls {
  display: grid;
  gap: 20px;
}

.counter-display {
  text-align: center;
}

.counter-value {
  font-size: 4em;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 10px;
}

.counter-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.badge-success { background: rgba(34, 197, 94, 0.2); color: #059669; }
.badge-warning { background: rgba(245, 158, 11, 0.2); color: #d97706; }
.badge-danger { background: rgba(239, 68, 68, 0.2); color: #dc2626; }
.badge-info { background: rgba(59, 130, 246, 0.2); color: #2563eb; }
.badge-secondary { background: rgba(107, 114, 128, 0.2); color: #6b7280; }

.counter-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

/* 统计信息样式 */
.stats-section h4 {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: var(--accent-color);
}

.stat-label {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-top: 5px;
}

/* 历史记录样式 */
.history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-count {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

.history-badge {
  background: var(--accent-color);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: bold;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
}

.history-action {
  font-weight: 500;
  color: var(--text-primary);
}

.history-change {
  font-family: monospace;
  color: var(--text-secondary);
  font-size: 0.9em;
}

.history-time {
  font-size: 0.8em;
  color: var(--text-muted);
  margin-top: 2px;
}

/* 按钮样式 */
.btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary { background: #6b7280; }
.btn-secondary:hover { background: #4b5563; }

.btn-info { background: #3b82f6; }
.btn-info:hover { background: #2563eb; }

.btn-success { background: #10b981; }
.btn-success:hover { background: #059669; }

.btn-warning { background: #f59e0b; }
.btn-warning:hover { background: #d97706; }

.btn-danger { background: #ef4444; }
.btn-danger:hover { background: #dc2626; }

.btn-link {
  background: transparent;
  color: var(--accent-color);
  text-decoration: underline;
}

.btn-link:hover {
  background: rgba(66, 184, 131, 0.1);
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .counter-actions {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .history-controls {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
