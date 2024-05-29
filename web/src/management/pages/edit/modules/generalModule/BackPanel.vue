<template>
  <div class="back-btn" @click="onBack">
    <i class="iconfont icon-fanhui"></i>
    <span>返回</span>
  </div>
</template>

<script setup lang="ts">
const onBack = () => {
  window.open('/survey', '_self')
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
