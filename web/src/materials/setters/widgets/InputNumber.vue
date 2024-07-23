<template>
  <el-input-number
    :placeholder="formConfig.placeholder"
    :modelValue="modelValue"
    @change="handleInputChange"
    :min="minModelValue"
    :max="maxModelValue"
  />
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
  moduleConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: number }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()
const modelValue = ref(Number(props.formConfig.value) || 0)
const minModelValue = computed(() => {
  const { min } = props.formConfig
  if (min) {
    if (typeof min === 'function') {
      return min(props.moduleConfig)
    } else {
      return Number(min)
    }
  }
  return -Infinity
})

const maxModelValue = computed(() => {
  const { max, min } = props.formConfig

  if (max) {
    if (typeof max === 'function') {
      return max(props.moduleConfig)
    } else {
      return Number(max)
    }
  } else if (min !== undefined && Array.isArray(props.moduleConfig?.options)) {
    return props.moduleConfig.options.length
  } else {
    return Infinity
  }
})

const handleInputChange = (value: number) => {
  const key = props.formConfig.key
  const reg = /^(-)?[0-9]+$/

  if (!reg.test(String(value))) {
    ElMessage.warning('只能输入整数')
  }

  modelValue.value = value

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
watch(
  () => props.formConfig.value,
  (newVal) => {
    if (newVal !== modelValue.value) {
      modelValue.value = newVal
    }
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.star-form.star-form_horizon {
  .star-form-label + .el-form-item {
    margin-left: 0px;
  }
}

.wrapper {
  .remark {
    color: red;
    margin-bottom: 10px;
    display: block;
    font-size: 12px;
  }
}
</style>
