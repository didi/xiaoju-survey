<template>
    <div class="preview-panel">
        <div class="preview-placeholder">
            <i class="iconfont icon-ai"></i>
            <p>AI生成结果将在此处预览</p>
            <el-button type="primary" class="generate-btn">立即生成</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')

</script>
<style lang="scss" scoped>
  .preview-panel {
    height: calc(100vh - 56px); //减掉导航条
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

</style>