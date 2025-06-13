import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const history = ref([])
  const maxHistorySize = ref(10)

  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)
  const historySize = computed(() => history.value.length)

  // 辅助函数：记录历史
  const recordHistory = (action, oldValue, newValue) => {
    const historyItem = {
      id: Date.now(),
      action,
      oldValue,
      newValue,
      timestamp: new Date().toLocaleString()
    }
    
    history.value.unshift(historyItem)
    
    // 限制历史记录数量
    if (history.value.length > maxHistorySize.value) {
      history.value = history.value.slice(0, maxHistorySize.value)
    }
  }

  // 操作方法
  const increment = (amount = 1) => {
    const oldValue = count.value
    count.value += amount
    recordHistory(`增加 ${amount}`, oldValue, count.value)
  }

  const decrement = (amount = 1) => {
    const oldValue = count.value
    count.value -= amount
    recordHistory(`减少 ${amount}`, oldValue, count.value)
  }

  const reset = () => {
    const oldValue = count.value
    count.value = 0
    recordHistory('重置', oldValue, count.value)
  }

  const setValue = (newValue) => {
    const oldValue = count.value
    count.value = newValue
    recordHistory(`设置为 ${newValue}`, oldValue, count.value)
  }

  const multiply = (factor) => {
    const oldValue = count.value
    count.value *= factor
    recordHistory(`乘以 ${factor}`, oldValue, count.value)
  }

  const divide = (divisor) => {
    if (divisor === 0) {
      throw new Error('不能除以零')
    }
    const oldValue = count.value
    count.value = Math.round(count.value / divisor)
    recordHistory(`除以 ${divisor}`, oldValue, count.value)
  }

  const power = (exponent) => {
    const oldValue = count.value
    count.value = Math.pow(count.value, exponent)
    recordHistory(`${exponent}次方`, oldValue, count.value)
  }

  const random = (min = 0, max = 100) => {
    const oldValue = count.value
    count.value = Math.floor(Math.random() * (max - min + 1)) + min
    recordHistory(`随机数 (${min}-${max})`, oldValue, count.value)
  }

  const clearHistory = () => {
    history.value = []
  }

  const setMaxHistorySize = (size) => {
    maxHistorySize.value = size
    if (history.value.length > size) {
      history.value = history.value.slice(0, size)
    }
  }

  // 撤销最后一个操作
  const undo = () => {
    if (history.value.length > 0) {
      const lastAction = history.value[0]
      count.value = lastAction.oldValue
      history.value.shift()
    }
  }

  // 获取统计信息
  const getStats = () => {
    const actions = history.value.map(h => h.action)
    const incrementCount = actions.filter(a => a.includes('增加')).length
    const decrementCount = actions.filter(a => a.includes('减少')).length
    const resetCount = actions.filter(a => a.includes('重置')).length
    
    return {
      currentValue: count.value,
      totalActions: history.value.length,
      incrementCount,
      decrementCount,
      resetCount,
      isEven: isEven.value,
      isPositive: isPositive.value,
      doubleValue: doubleCount.value
    }
  }

  return {
    // 状态
    count,
    history,
    maxHistorySize,
    
    // 计算属性
    doubleCount,
    isEven,
    isPositive,
    isNegative,
    historySize,
    
    // 方法
    increment,
    decrement,
    reset,
    setValue,
    multiply,
    divide,
    power,
    random,
    clearHistory,
    setMaxHistorySize,
    undo,
    getStats
  }
})
