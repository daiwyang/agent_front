<template>
  <div class="upload-demo-page">
    <div class="page-header">
      <h1>📁 文件上传演示</h1>
      <p>展示自定义文件上传组件的各种功能</p>
    </div>

    <div class="demo-container">
      <!-- 基础上传 -->
      <div class="demo-section">
        <h2>基础文件上传</h2>
        <FileUpload
          :multiple="true"
          :max-size="5 * 1024 * 1024"
          upload-url="/api/upload"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
          @file-selected="handleFileSelected"
        />
      </div>

      <!-- 图片上传 -->
      <div class="demo-section">
        <h2>图片上传（仅限图片格式）</h2>
        <FileUpload
          :multiple="true"
          accept="image/*"
          :max-size="2 * 1024 * 1024"
          upload-url="/api/upload/images"
          @upload-success="handleImageUploadSuccess"
        />
      </div>

      <!-- 单文件上传 -->
      <div class="demo-section">
        <h2>单文件上传</h2>
        <FileUpload
          :multiple="false"
          accept=".pdf,.doc,.docx"
          :max-size="10 * 1024 * 1024"
          upload-url="/api/upload/documents"
        />
      </div>

      <!-- 上传历史 -->
      <div v-if="uploadHistory.length > 0" class="demo-section">
        <h2>📋 上传历史</h2>
        <div class="upload-history">
          <div 
            v-for="(item, index) in uploadHistory" 
            :key="index"
            class="history-item"
          >
            <div class="history-info">
              <div class="history-filename">{{ item.filename }}</div>
              <div class="history-details">
                <span class="history-size">{{ item.size }}</span>
                <span class="history-time">{{ item.uploadTime }}</span>
              </div>
            </div>
            <div class="history-status">
              <span :class="['status-badge', item.status]">
                {{ getStatusText(item.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="demo-section">
        <h2>📊 上传统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalFiles }}</div>
            <div class="stat-label">总文件数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.successFiles }}</div>
            <div class="stat-label">成功上传</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.failedFiles }}</div>
            <div class="stat-label">上传失败</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatFileSize(stats.totalSize) }}</div>
            <div class="stat-label">总大小</div>
          </div>
        </div>
      </div>
    </div>

    <div class="back-section">
      <router-link to="/" class="back-btn">
        ← 返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import FileUpload from '../components/FileUpload.vue'

export default {
  name: 'UploadDemo',
  components: {
    FileUpload
  },
  setup() {
    const uploadHistory = ref([])
    
    const stats = computed(() => {
      return {
        totalFiles: uploadHistory.value.length,
        successFiles: uploadHistory.value.filter(item => item.status === 'success').length,
        failedFiles: uploadHistory.value.filter(item => item.status === 'error').length,
        totalSize: uploadHistory.value.reduce((total, item) => total + (item.sizeBytes || 0), 0)
      }
    })
    
    const handleUploadSuccess = (data) => {
      console.log('上传成功:', data)
      
      uploadHistory.value.unshift({
        filename: data.file.name,
        size: formatFileSize(data.file.size),
        sizeBytes: data.file.size,
        uploadTime: new Date().toLocaleString(),
        status: 'success',
        response: data.response
      })
    }
    
    const handleUploadError = (data) => {
      console.error('上传失败:', data)
      
      uploadHistory.value.unshift({
        filename: data.file.name,
        size: formatFileSize(data.file.size),
        sizeBytes: data.file.size,
        uploadTime: new Date().toLocaleString(),
        status: 'error',
        error: data.error.message
      })
    }
    
    const handleFileSelected = (files) => {
      console.log('文件已选择:', files)
    }
    
    const handleImageUploadSuccess = (data) => {
      console.log('图片上传成功:', data)
      handleUploadSuccess(data)
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        success: '成功',
        error: '失败',
        uploading: '上传中'
      }
      return statusMap[status] || status
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    return {
      uploadHistory,
      stats,
      handleUploadSuccess,
      handleUploadError,
      handleFileSelected,
      handleImageUploadSuccess,
      getStatusText,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.upload-demo-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
  color: white;
}

.page-header p {
  font-size: 1.2em;
  opacity: 0.9;
  margin: 0;
}

.demo-container {
  margin: 40px 0;
}

.demo-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px var(--shadow);
}

.demo-section h2 {
  color: var(--accent-color);
  margin-bottom: 25px;
  font-size: 1.5em;
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 10px;
}

.upload-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow);
}

.history-info {
  flex: 1;
}

.history-filename {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.history-details {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: var(--text-secondary);
}

.history-status {
  margin-left: 15px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.status-badge.success {
  background: rgba(34, 197, 94, 0.2);
  color: #059669;
}

.status-badge.error {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.status-badge.uploading {
  background: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--shadow);
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 10px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.back-section {
  text-align: center;
  margin-top: 50px;
}

.back-btn {
  display: inline-block;
  padding: 12px 30px;
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.3);
}

.back-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .history-item {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .history-details {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
