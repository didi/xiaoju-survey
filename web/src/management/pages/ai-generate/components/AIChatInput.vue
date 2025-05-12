<template>
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
  </template>


<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const handleGenerate = () => {
  // 生成逻辑保持不变
}
</script>

<style lang="scss" scoped>
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
</style>