<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
const prompt = ref('')
const emit = defineEmits(['generate'])
const messages = ref<Array<{sender: 'user'|'ai', content: string}>>([])

// 新增键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault()
    handleGenerate()
  }
}

const handleGenerate = async () => {
  const currentPrompt = prompt.value.trim(); // 先保存当前输入内容
  if (currentPrompt) {
    // 添加用户消息
    messages.value.push({
      sender: 'user',
      content: currentPrompt
    });
    
    // 清空输入框
    prompt.value = '';
    
    try {
      // 调用后端接口
      const response = await axios.post('/api/ai-generate/test-deepseek', {
        prompt: currentPrompt // 使用保存的输入内容
      });
      
      // 添加AI回复，并去除前面的换行符
      messages.value.push({
        sender: 'ai',
        content: response.data.data.rawContent.replace(/^\n+/, '') // 去除前面的换行符
      });
      emit('generate', response.data.data.rawContent.replace(/^\n+/, '') ) // 新增此行
    } catch (error) {
      // 错误处理
      messages.value.push({
        sender: 'ai',
        content: '生成失败，请稍后再试'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel {
  height: calc(100vh - 56px);
  overflow: hidden;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  .chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 40px 12px 120px 12px; // 增加底部内边距，为dialog-area留出空间
  position: relative;
  z-index: 1;
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
      user-select: text !important;
      -webkit-user-select: text !important;
      padding: 12px 16px;
      border-radius: 12px;
      margin: 0 12px;
      text-align: left;  
      width: 80%;
      max-width: 80%; // 添加最大宽度限制
    }

    &.user {
      flex-direction: row-reverse;
      
      .bubble {
        background: #FEF6E6;
        border: 1px solid #FEF6E6;
        margin-left: auto; // 确保用户消息靠右对齐
      }
    }

    &.ai {
      .bubble {
        background: #F2F4F7;
        border: 1px solid #F2F4F7;
        margin-right: auto; // 确保AI消息靠左对齐
      }
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
    :deep(.el-textarea__inner) {
      background: #f2f4f7 !important;
      box-shadow: none !important;
      user-select: text !important; // 允许文本选择
      -webkit-user-select: text !important;
    }
    display: flex;
    background: #f2f4f7 !important;

    .send-icon {
      width: 64px !important;
      height: 64px !important;
      transition: none;
      right: 15px;
      bottom: 15px;
      
      &:hover {
        transform: none;
        filter: brightness(0.9);
      }
    }


  }
}
}
</style>