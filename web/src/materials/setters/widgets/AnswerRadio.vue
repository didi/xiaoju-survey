<template>
  <div class="answer-radio-wrap">
    <el-radio-group v-model="whitelistType"   @change="handleRadioGroupChange">
      <el-radio value="ALL">所有人</el-radio>
      <el-radio value="MEMBER">空间成员</el-radio>
      <el-radio value="CUSTOM">白名单</el-radio>
    </el-radio-group>
  </div>
</template>
<script setup>

import { ref } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])

const whitelistType = ref(props.formConfig?.value || 'ALL')

const handleRadioGroupChange = (value) => {
  const key = props.formConfig.key
  console.log(key, value)
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
  emit(FORM_CHANGE_EVENT_KEY, { key:'whitelist', value: [] })
  emit(FORM_CHANGE_EVENT_KEY, { key: 'memberType', value: 'MOBILE' })
  if (whitelistType.value == 'ALL') { 
    emit(FORM_CHANGE_EVENT_KEY, { key:'whitelistTip', value:'' })
  }
}


</script>
<style lang="scss" scoped>
.switch-input-wrap{
  width: 100%;
  .mt16{
    margin-top: 16px;
  }
}
</style>