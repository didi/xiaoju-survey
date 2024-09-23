<template>
  <el-tabs type="border-card" v-model="tabSelected" stretch class="tab-box">
    <el-tab-pane label="题型选择">
      <TypeList />
    </el-tab-pane>
    <el-tab-pane label="题目大纲">
      <QuestionCatalog />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import TypeList from './components/TypeList.vue'
import QuestionCatalog from './components/QuestionCatalog.vue'

const tabSelected = ref<string>('0')
</script>
<style lang="scss" scoped>
.tab-box {
  width: 360px;
  height: 100%;
  box-shadow: none;
  border: none;
  :deep(.el-tabs__nav) {
    width: 100%;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    overflow-y: auto;
  }
  :deep(.el-tabs__item) {
    text-align: center;
  }

  &.el-tabs--border-card :deep(.el-tabs__item:last-child.is-active) {
    border-right-color: transparent;
  }
}
</style>
