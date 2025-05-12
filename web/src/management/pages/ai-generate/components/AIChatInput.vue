<template>
    <div class="dialog-area">
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
  </template>

<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')  // 子组件自己维护状态

// 当用户点击发送时暴露数据
const emit = defineEmits(['generate'])

const handleGenerate = () => {
  emit('generate', prompt.value)  // 向父级传递生成内容
}
</script>

<style lang="scss" scoped>
.dialog-area {
  height: 100%;
  display: flex;
  flex-direction: column;

  .dialog-background {
    height: 120px;
    background: url('/imgs/AI/Gradual_Background.webp') no-repeat;
    background-size: cover;
  }

  .input-section {
    flex: 1;
    position: relative;
    background: #f2f4f7;
    padding: 20px;

    .custom-input {
      height: 100%;
      
      :deep(.el-textarea__inner) {
        background: #f2f4f7 !important;
        border: none;
        padding-right: 60px;
        height: 100% !important;
      }
    }

    .send-icon {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: filter 0.2s;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }
}
</style>