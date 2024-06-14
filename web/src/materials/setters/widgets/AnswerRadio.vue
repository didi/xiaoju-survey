<template>
  <div class="answer-radio-wrap">
    <el-radio-group v-model="answerVal">
      <el-radio :value="1">所有人</el-radio>
      <el-radio :value="2">空间成员</el-radio>
      <el-radio :value="3">白名单</el-radio>
    </el-radio-group>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const answerVal = ref(false)


</script>
<style lang="scss" scoped>
.switch-input-wrap{
  width: 100%;
  .mt16{
    margin-top: 16px;
  }
}
</style>