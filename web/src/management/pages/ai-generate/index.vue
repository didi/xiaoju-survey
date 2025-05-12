<template>
  <div class="ai-generate-container">
    <!-- 顶部导航栏 -->
    <div class="generate-nav">
      <div class="nav-left">
        <img src="/imgs/s-logo.webp" class="logo" />
        <el-button link @click="goBack">
          <i class="iconfont icon-fanhui"></i>
          返回
        </el-button>
      </div>
      <h2 class="nav-title">AI智能生成问卷</h2>
      <el-button type="primary" @click="handleCreate">确定创建</el-button>
    </div>

    <!-- 主体内容区 -->
    <div class="generate-content">
      <!-- 左侧配置区 -->
      <div class="config-panel">
        <div class="dialog-area">
          <div class="dialog-background"></div>
          <div class="input-section">
            <el-input
              v-model="prompt"
              type="textarea"
              :rows="5"
              placeholder="请输入您想生成的问卷相关描述（目前暂不支持通过对话修改已生成的问卷）"
              class="custom-input"
            />
            <img 
              src="/imgs/AI/icon_Sent.svg" 
              class="send-icon"
              @click="handleGenerate"
            />
          </div>
        </div>
      </div>
      
      <!-- 右侧预览区 -->
      <div class="preview-panel">
        <div class="preview-placeholder">
          <i class="iconfont icon-ai"></i>
          <p>AI生成结果将在此处预览</p>
          <el-button type="primary" class="generate-btn">立即生成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import AIChatInput from './components/AIChatInput.vue'
// import PreviewPanel from './components/PreviewPanel.vue'


const router = useRouter()
const prompt = ref('')

const goBack = () => {
  router.go(-1)
}

const handleCreate = () => {
  // 后续补充创建逻辑
}

const handleGenerate = () => {
  // 后续补充生成逻辑
}
</script>

<style lang="scss" scoped>
.ai-generate-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .generate-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 56px;
    border-bottom: 1px solid #eee;

    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .logo {
        height: 32px;
      }
    }

    .nav-title {
      font-size: 18px;
      color: #333;
    }
  }
}

.generate-content {
  flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 24px;

  .config-panel {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 0 !important;
    height: 100%;
    display: flex;
    flex-direction: column;

    .dialog-background {
      height: 12.5%;
      background: url('/imgs/AI/Gradual_Background.webp') no-repeat;
      background-size: cover;
    }

    .dialog-area {
      flex: 1;
      display: flex;
      flex-direction: column;

      .dialog-background {
        height: 87.5%;  
        flex-shrink: 1; 
      }

      .input-section {
        flex: 1;  
        position: relative;
        display: flex;  // 新增
        background: #f2f4f7;  // 外层容器灰色背景
        padding: 0px;
            .custom-input {
                width: 100%;
                :deep(.el-textarea__inner) {
                background: #f2f4f7 !important;  // 内层输入框背景
                border: none;                   // 移除默认边框
                padding-right: 60px;            // 给发送图标留出空间
                }
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
  }

  .preview-panel {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 20px;
    .preview-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      
      .icon-ai {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      .generate-btn {
        margin-top: 24px;
      }
    }
  }
}
</style>
