<template>
  <div class="back-btn" @click="handleNavigateHome">
    <i class="iconfont icon-fanhui"></i>
    <span>返回</span>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const handleNavigateHome = () => {
  router.push({
    name: 'survey'
  })
}
</script>
<style lang="scss" scoped>
.back-btn {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
  }
}
</style>
