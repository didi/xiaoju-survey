<template>
  <div class="switch-input-wrap">
    <el-switch v-model="switchVal" />
    <el-input
    v-if="switchVal"
      class="mt16"
      maxlength="6"
      placeholder="请输入6位字符串类型访问密码"
      show-word-limit
      type="text"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const switchVal = ref(false)


</script>
<style lang="scss" scoped>
.switch-input-wrap{
  width: 100%;
  .mt16{
    margin-top: 16px;
  }
}
</style>