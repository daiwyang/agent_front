<template>
  <div class="file-upload">
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'has-files': files.length > 0 }"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <div v-if="files.length === 0" class="upload-placeholder">
        <div class="upload-icon">📁</div>
        <p class="upload-text">
          <span>拖拽文件到这里或</span>
          <span class="upload-link">点击选择文件</span>
        </p>
        <p class="upload-hint" v-if="accept">
          支持格式：{{ acceptText }}
        </p>
      </div>
      
      <div v-else class="file-list">
        <div 
          v-for="(file, index) in files" 
          :key="index" 
          class="file-item"
        >
          <div class="file-info">
            <div class="file-icon">📄</div>
            <div class="file-details">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
          </div>
          
          <div class="file-actions">
            <div v-if="file.uploading" class="upload-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: file.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ file.progress }}%</span>
            </div>
            
            <button 
              v-if="!file.uploading && !file.uploaded"
              @click.stop="uploadFile(file, index)"
              class="btn btn-small btn-success"
            >
              上传
            </button>
            
            <span v-if="file.uploaded" class="upload-status success">✅</span>
            <span v-if="file.error" class="upload-status error">❌</span>
            
            <button 
              @click.stop="removeFile(index)"
              class="btn btn-small btn-danger"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="files.length > 0" class="upload-controls">
      <button 
        @click="uploadAll"
        :disabled="uploading"
        class="btn btn-primary"
      >
        {{ uploading ? '上传中...' : '上传所有文件' }}
      </button>
      
      <button 
        @click="clearAll"
        class="btn btn-secondary"
      >
        清空列表
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FileUpload',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    uploadUrl: {
      type: String,
      default: '/api/upload'
    }
  },
  emits: ['upload-success', 'upload-error', 'file-selected'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const files = ref([])
    const isDragOver = ref(false)
    const uploading = ref(false)
    const error = ref('')
    
    const acceptText = computed(() => {
      if (!props.accept) return '所有文件'
      return props.accept.split(',').map(type => type.trim()).join(', ')
    })
    
    const triggerFileInput = () => {
      fileInput.value.click()
    }
    
    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files)
      addFiles(selectedFiles)
    }
    
    const handleDrop = (event) => {
      event.preventDefault()
      isDragOver.value = false
      
      const droppedFiles = Array.from(event.dataTransfer.files)
      addFiles(droppedFiles)
    }
    
    const handleDragOver = (event) => {
      event.preventDefault()
      isDragOver.value = true
    }
    
    const handleDragLeave = () => {
      isDragOver.value = false
    }
    
    const addFiles = (newFiles) => {
      error.value = ''
      
      for (const file of newFiles) {
        // 文件大小验证
        if (file.size > props.maxSize) {
          error.value = `文件 "${file.name}" 超过最大允许大小 ${formatFileSize(props.maxSize)}`
          continue
        }
        
        // 文件类型验证
        if (props.accept && !isFileTypeAccepted(file)) {
          error.value = `文件 "${file.name}" 格式不支持`
          continue
        }
        
        // 检查重复文件
        const existingFile = files.value.find(f => 
          f.name === file.name && f.size === file.size
        )
        if (existingFile) {
          error.value = `文件 "${file.name}" 已存在`
          continue
        }
        
        files.value.push({
          file,
          name: file.name,
          size: file.size,
          uploading: false,
          uploaded: false,
          progress: 0,
          error: false
        })
      }
      
      emit('file-selected', files.value)
    }
    
    const isFileTypeAccepted = (file) => {
      if (!props.accept) return true
      
      const acceptedTypes = props.accept.split(',').map(type => type.trim())
      return acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type.replace('*', '.*'))
      })
    }
    
    const uploadFile = async (fileData, index) => {
      fileData.uploading = true
      fileData.error = false
      fileData.progress = 0
      
      try {
        // 导入模拟上传API
        const { uploadApi } = await import('../apis/index.js')
        
        const response = await uploadApi.upload(fileData.file, (progress) => {
          fileData.progress = progress
        })
        
        fileData.uploaded = true
        fileData.uploading = false
        emit('upload-success', {
          file: fileData,
          response: response
        })
        
      } catch (err) {
        fileData.uploading = false
        fileData.error = true
        error.value = err.message
        emit('upload-error', { file: fileData, error: err })
      }
    }
    
    const uploadAll = async () => {
      uploading.value = true
      
      const unUploadedFiles = files.value.filter(f => !f.uploaded && !f.uploading)
      
      for (let i = 0; i < unUploadedFiles.length; i++) {
        const fileData = unUploadedFiles[i]
        const index = files.value.indexOf(fileData)
        await uploadFile(fileData, index)
      }
      
      uploading.value = false
    }
    
    const removeFile = (index) => {
      files.value.splice(index, 1)
    }
    
    const clearAll = () => {
      files.value = []
      error.value = ''
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    return {
      fileInput,
      files,
      isDragOver,
      uploading,
      error,
      acceptText,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      uploadFile,
      uploadAll,
      removeFile,
      clearAll,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.file-upload {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: rgba(66, 184, 131, 0.05);
}

.upload-area.drag-over {
  border-color: var(--accent-color);
  background: rgba(66, 184, 131, 0.1);
  transform: scale(1.02);
}

.upload-area.has-files {
  min-height: auto;
  padding: 20px;
  cursor: default;
}

.upload-placeholder {
  width: 100%;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  color: var(--text-muted);
}

.upload-text {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.upload-link {
  color: var(--accent-color);
  font-weight: 500;
}

.upload-hint {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.file-list {
  width: 100%;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.file-size {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 35px;
}

.upload-status {
  font-size: 1.2rem;
}

.upload-status.success {
  color: #10b981;
}

.upload-status.error {
  color: #ef4444;
}

.upload-controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
}

.btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
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

.btn-small {
  padding: 4px 8px;
  font-size: 0.8rem;
}

.btn-primary {
  background: var(--accent-color);
}

.btn-secondary {
  background: #6b7280;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 20px;
  }
  
  .file-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .file-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .upload-controls {
    flex-direction: column;
  }
}
</style>
