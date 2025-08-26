<template>
  <div :class="['message', message.sender]">
    <img 
      :src="message.sender === 'user' ? '/imgs/AI/User_Headshot_Round.webp' : '/imgs/AI/XIAOJU_Headshot_Round.webp'" 
      class="avatar"
    />
    <div class="bubble">
      <div 
        v-if="message.sender === 'ai' && message.status === 'generating'"
        class="generating-notice"
      >
        <span style="color: #6E707C;">请稍后，生成问卷努力敲击中....</span>
        <span 
          style="color: #FAA600; margin-left: 8px; cursor: pointer;"
          @click="handleStopGenerating"
        >停止生成</span>
      </div>
      
      <!-- 思考内容区域 -->
      <div 
        v-if="message.sender === 'ai' && message.reasoningContent" 
        class="reasoning-content"
      >
        <div class="reasoning-header">
          <span class="reasoning-icon">💭</span>
          <span>思考过程</span>
        </div>
        <div class="reasoning-text">{{ message.reasoningContent }}</div>
      </div>
      
      <template v-if="message.content === 'loading'">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </template>
      <template v-else>
        {{ message.content }}
      </template>
      <div 
        v-if="message.sender === 'ai' && 
              message.content !== 'loading' && 
              message.status === 'finished' &&
              message.showReset"  
        class="action-buttons"
      >
        <div class="action-item" @click="handleRegenerate">
          <i class="iconfont icon-gengxin"></i>
          <span>重新生成</span>
        </div>
        <div class="action-item" @click="handleLike">
          <i class="iconfont icon-zan"></i>
        </div>
        <div class="action-item" @click="handleDislike">
          <i class="iconfont icon-cai"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
  reasoningContent?: string
  status?: 'generating' | 'finished'
  showReset?: boolean
  userInput?: string
}

interface Props {
  message: Message
}

const props = defineProps<Props>()

const emit = defineEmits<{
  regenerate: [messageId: string]
  stopGenerating: []
  like: []
  dislike: []
}>()

const handleRegenerate = () => {
  emit('regenerate', props.message.id)
}

const handleStopGenerating = () => {
  emit('stopGenerating')
}

const handleLike = () => {
  emit('like')
}

const handleDislike = () => {
  emit('dislike')
}
</script>

<style lang="scss" scoped>
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
    max-width: 565px;
    white-space: pre-wrap;
    position: relative;
  }
  
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FAA600;
    margin: 0 2px;
    animation: dot-bounce 1.4s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes dot-bounce {
    0%, 80%, 100% { 
      transform: translateY(0);
      opacity: 0.5;
    }
    40% {
      transform: translateY(-6px);
      opacity: 1;
    }
  }

  &.user {
    flex-direction: row-reverse;
    .bubble {
      background: #FEF6E6;
      border: 1px solid #FEF6E6;
      margin-left: auto;
      
      &::after {
        content: '';
        position: absolute;
        right: -8px;
        top: 16px;
        width: 0;
        height: 0;
        border-left: 8px solid #FEF6E6;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }
    }
  }
  
  &.ai .bubble {
    background: #F2F4F7;
    border: 1px solid #F2F4F7;
    margin-right: auto;
    position: relative;
    min-width: 288px;
    
    &::after {
      content: '';
      position: absolute;
      left: -8px;
      top: 16px;
      width: 0;
      height: 0;
      border-right: 8px solid #F2F4F7;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
    }
    
    .reasoning-content {
      margin-bottom: 12px;
      padding: 12px;
      background: rgba(250, 166, 0, 0.1);
      border-radius: 8px;
      border-left: 3px solid #FAA600;
      
      .reasoning-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-family: PingFangSC;
        font-size: 12px;
        font-weight: 500;
        color: #FAA600;
        
        .reasoning-icon {
          font-size: 14px;
          margin-right: 4px;
        }
      }
      
      .reasoning-text {
        font-family: PingFangSC;
        font-size: 13px;
        line-height: 1.5;
        color: #4A4C5B;
        white-space: pre-wrap;
      }
    }
    
    .action-buttons {
      position: absolute;
      right: 16px;
      bottom: -24px;
      display: flex;
      gap: 16px;
      align-items: center;
      
      .action-item {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        font-family: PingFangSC;
        font-size: 12px;
        font-weight: normal;
        line-height: 18px;
        letter-spacing: normal;
        color: #FAA600;

        .icon-zan,
        .icon-cai {
          color: #C8C9CD;
        }   
        
        .iconfont {
          font-size: 16px;
        }
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .generating-notice {
    position: absolute;
    left: 0;
    bottom: -28px;
    font-family: PingFangSC;
    font-size: 12px;
    font-weight: normal;
    line-height: 18px;
    letter-spacing: normal;
    white-space: nowrap;
  }
}
</style>
