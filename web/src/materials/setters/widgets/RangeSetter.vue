<template>
  <div class="range-wrapper">
    <el-input-number
      :modelValue="minModelValue"
      @change="handleRangeChange('min', $event)"
      :min="0"
    />
    <span class="split-text">至</span>
    <el-input-number
      :modelValue="maxModelValue"
      @change="handleRangeChange('max', $event)"
      :min="0"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import { ElMessage } from 'element-plus'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

import 'element-plus/theme-chalk/src/message.scss'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: number }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const minModelValue = computed(() => {
  const minValue = props.formConfig?.value?.min?.value

  return parseInt(minValue)
})

const maxModelValue = computed(() => {
  const maxValue = props.formConfig?.value?.max?.value

  return maxValue ? parseInt(maxValue) : 1
})

const handleRangeChange = (eventType: 'max' | 'min', value: number) => {
  const key = props.formConfig.key
  const initMinValue = minModelValue.value
  const initMaxValue = maxModelValue.value

  if (
    (eventType === 'max' && value < initMinValue) ||
    (eventType === 'min' && value > initMaxValue)
  ) {
    ElMessage({
      type: 'info',
      message:
        eventType === 'min' ? '最小值大于最大值，请重新输入！' : '最大值小于最小值，请重新输入！'
    })

    return
  }

  emit(FORM_CHANGE_EVENT_KEY, {
    key: `${key}.${eventType}.value`,
    value
  })
}
</script>
<style lang="scss" scoped>
.range-wrapper {
  .el-input-number {
    width: 40%;
  }

  .split-text {
    font-size: 14px;
    padding: 0 15px;
    color: #6e707c;
  }
}
</style>
