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
      height:calc(100vh - 56px);
      overflow: hidden;  // 隐藏全局滚动条
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;  // 关键修复 ↓
    }

    .panel-background {
      height: 20%;
      background: url('/imgs/AI/Gradual_Background.webp') no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .chat-container {
      flex: 1;
      overflow-y: scroll;
      // height: calc(100vh - 56px);  // 新增;
      padding-top: 40px;  // 增加顶部内边距 ↓↓↓
      .message {
        display: flex;
        margin-bottom: 16px;
        margin-left: 12px;  // 新增左边距
        margin-right: 12px; // 新增右边距

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 0 8px;  
        }
        
        .bubble {
          user-select: text !important;  // 添加!important覆盖全局样式
          -webkit-user-select: text !important;
          padding: 12px 16px;
          border-radius: 12px;
          margin: 0 12px;
          text-align: left;  
          width: 80%;
        }

        &.user {
          flex-direction: row-reverse;
          
          .bubble {
            background: #FEF6E6;
            border: 1px solid #FEF6E6;;
          }
        }

        &.ai {
          .bubble {
            background: #F2F4F7;
            border: 1px solid #F2F4F7;
          }
        }
      }
    }
    .dialog-area {
      flex-shrink: 0;  // 固定输入区域高度 
      position: absolute; 
      bottom: 0;
      left: 0;
      right: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      .input-section {
        :deep(.el-textarea__inner) {
          background: #f2f4f7 !important;  // 强制保持灰色背景
          box-shadow: none !important;     // 移除可能干扰的阴影
        }
        flex: 1;  
        display: flex;  // 新增
        background: #f2f4f7 !important;   // 外层容器灰色背景
            .custom-input {
              
                width: 80vh;
                padding-right: 60px;            // 给发送图标留出空间
            }
            /* 修复发送图标缩放问题 */
            .send-icon {
                width: 64px !important;          // 固定宽度
                height: 64px !important;         // 固定高度
                transition: none;                // 移除缩放动画
                right: 15px;                     // 调整位置
                bottom: 15px;
                
                &:hover {
                transform: none;               // 禁用悬停效果
                filter: brightness(0.9);       // 改用颜色变化
                }
            }

      }
      
  }
</style>