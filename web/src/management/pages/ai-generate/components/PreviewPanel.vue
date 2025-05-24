<template>
    <div class="right-panel">
      <MultiSourcePreviewPanel 
      :questionDataList="questionList"
      mode="preview"
    />
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue'
import { textToSchema } from '@/management/utils/textToSchema'

// 修复：添加 props 声明和引用
const props = defineProps<{
  aiContent: string
}>()

const questionList = computed(() => {
  try {
    return textToSchema(props.aiContent, { showIndex: false }) // 现在可以正确访问 props
  } catch (e) {
    return []
  }
})
</script>
<style lang="scss" scoped>
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