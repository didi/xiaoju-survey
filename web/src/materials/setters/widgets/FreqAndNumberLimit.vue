<template>
  <el-form-item>
    <el-select
      class="option-select"
      placeholder="请选择"
      :value="formConfig.value[formConfig.selectKey]"
      @change="handleInputChange($event, formConfig.selectKey)"
    >
      <el-option
        v-for="item in formConfig.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <template v-if="isShowNumberFn">
      <span class="option-txt">提交</span>
      <el-input-number
        v-model="modelValue"
        @change="handleInputChange($event, formConfig.numberKey)"
      ></el-input-number>
      <span class="option-txt">次</span>
    </template>
  </el-form-item>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { get as _get } from 'lodash-es'

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const modelValue = ref(Number(_get(props.formConfig.value, props.formConfig.numberKey, 0)))
const isShowNumberFn = computed(() => !!props.formConfig.value[props.formConfig.selectKey])

const handleInputChange = (value: string, key: string) => {
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
</script>
<style lang="scss" scoped>
.option-select {
  width: 130px !important;
}
.option-txt {
  margin: 0 10px;
}
</style>
