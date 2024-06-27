<template>
  <div class="switch-input-wrap">
    <el-switch v-model="passwordSwitch" @change="changeData(props.formConfig.keys[0],passwordSwitch)"  />
    <el-input
      v-if="passwordSwitch"
      class="mt16"
      maxlength="6"
      placeholder="请输入6位字符串类型访问密码"
      show-word-limit
      v-model="password"
      type="text"
      @blur="changeData(props.formConfig.keys[1],password)"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])
const passwordSwitch = ref(props.formConfig?.value[0] || false);
const password = ref(props.formConfig?.value[1] || '');

const changeData = (key,value) => {
  emit(FORM_CHANGE_EVENT_KEY, {
    key,
    value
  })

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