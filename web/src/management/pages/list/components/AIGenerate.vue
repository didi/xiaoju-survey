<template>
  <div class="ai-generate-container">
    <!-- 整合聊天输入和预览面板 -->
    <div class="generate-content">
      <!-- 左侧聊天输入区域 -->
      <div class="left-panel">      
        <div class="chat-container">
          <div class="panel-background"></div>
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="['message', msg.sender]"
          >
            <img 
              :src="msg.sender === 'user' ? '/imgs/AI/User_Headshot_Round.webp' : '/imgs/AI/XIAOJU_Headshot_Round.webp'" 
              class="avatar"
            />
            <div class="bubble" style="white-space: pre-wrap;">{{ msg.content }}</div>
          </div>
        </div>
        <div class="dialog-area">
          <div class="input-section">
            <el-input
              v-model="prompt"
              type="textarea"
              :rows="5"
              placeholder="请输入您想生成的问卷相关描述（目前暂不支持通过对话修改已生成的问卷）"
              @keydown.enter="handleKeydown"
            />
            <img 
              src="/imgs/AI/icon_Sent.svg" 
              class="send-icon"
              @click="handleGenerate"
            />
          </div>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div class="right-panel">
        <MultiSourcePreviewPanel 
          :questionDataList="questionList"
          mode="preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue'
import { textToSchema } from '@/management/utils/textToSchema'

const prompt = ref('')
const messages = ref<Array<{sender: 'user'|'ai', content: string}>>([])
const emit = defineEmits(['change'])

// 生成题目列表
const questionList = computed(() => {
  try {
    return textToSchema(
      messages.value.find(m => m.sender === 'ai')?.content || '',
      { showIndex: false }
    )
  } catch (e) {
    return []
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault()
    handleGenerate()
  }
}

const handleGenerate = async () => {
  const currentPrompt = prompt.value.trim()
  if (currentPrompt) {
    messages.value.push({ sender: 'user', content: currentPrompt })
    prompt.value = ''

    try {
      const response = await axios.post('/api/ai-generate/test-deepseek', {
        prompt: currentPrompt
      })
      
      const aiContent = response.data.data.rawContent.replace(/^\n+/, '')
      messages.value.push({ sender: 'ai', content: aiContent })
      emit('change', aiContent)
    } catch (error) {
      messages.value.push({ sender: 'ai', content: '生成失败，请稍后再试' })
    }
  }
}
</script>

<!-- 合并后的样式 -->
<style lang="scss" scoped>
.ai-generate-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .generate-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.left-panel {
  height: calc(100vh - 56px);
  overflow: hidden;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  
  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 40px 12px 120px 12px;
    position: relative;
    
    .panel-background {
      height: 20%;
      background: url('/imgs/AI/Gradual_Background.webp') no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 0;
    }
    
    .message {
      display: flex;
      margin-bottom: 16px;
      
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 8px;
      }
      
      .bubble {
        padding: 12px 16px;
        border-radius: 12px;
        margin: 0 12px;
        width: 80%;
        max-width: 80%;
      }
      
      &.user {
        flex-direction: row-reverse;
        .bubble {
          background: #FEF6E6;
          border: 1px solid #FEF6E6;
          margin-left: auto;
        }
      }
      
      &.ai .bubble {
        background: #F2F4F7;
        border: 1px solid #F2F4F7;
        margin-right: auto;
      }
    }
  }

  .dialog-area {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 3;
    
    .input-section {
      display: flex;
      background: #f2f4f7;
      
      :deep(.el-textarea__inner) {
        background: #f2f4f7 !important;
        box-shadow: none !important;
      }
      
      .send-icon {
        width: 64px;
        height: 64px;
        &:hover { filter: brightness(0.9); }
      }
    }
  }
}

.right-panel {
    height: calc(100vh - 56px);
    display: flex;
    background: #fff; // 添加背景色
  
    :deep(.multi-source-list) {
      flex-direction: column;  // 修改布局方向
      
      .left-panel {
        display: none !important;  // 隐藏左侧空白面板
      }
      
      .right-panel {
        align-items: flex-start !important;  // 顶部对齐
        width: 100% !important;  // 强制右侧面板全宽
        height: 100%;
        .questions-preview-wrapper {
          width: 100% !important;  // 解除宽度限制
          max-width: none;
          height: 100%;
          margin: auto 0 !important;  // 上下自动间距
        }
      }
    }
    :deep(.material-group .question-title) {
    &::before {
      content: "" !important;
      display: none !important;
    }
    
    // 调整标题间距
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  }
</style>