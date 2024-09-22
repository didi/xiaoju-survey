<template>
  <div class="question-list-root">
    <TopNav></TopNav>
    <div class="table-container">
      <TaskList></TaskList>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/management/components/TopNav.vue'
import TaskList from './components/TaskList.vue'
</script>

<style lang="scss" scoped>
.question-list-root {
  height: 100%;
  background-color: #f6f7f9;
  .table-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    width: 100%; /* 确保容器宽度为100% */
  }
}
</style>
