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
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { QUESTION_TYPE } from '@/common/typeEnum'
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
const setterTypes = [QUESTION_TYPE.CHECKBOX, QUESTION_TYPE.VOTE]
const modelValue = ref(props.formConfig.value || 0)
const minModelValue = computed(() => {
  const { min } = props.formConfig
  const { type } = props.moduleConfig

  if (min !== undefined) {
    if (typeof min === 'string') {
      return setterTypes.includes(type)
        ? Number(props.moduleConfig[min])
        : Number(Number(props.moduleConfig[min]) + 1)
    } else if (typeof props.formConfig.min === 'function') {
      return min(props.moduleConfig)
    } else {
      return Number(min)
    }
  }
  return -Infinity
})

const maxModelValue = computed(() => {
  const { type } = props.moduleConfig
  const { max, min } = props.formConfig

  if (max) {
    if (typeof max === 'string') {
      return setterTypes.includes(type)
        ? Number(props.moduleConfig[max])
        : props.moduleConfig[max] - 1
    } else if (typeof max === 'function') {
      return max(props.moduleConfig)
    }
    return Number(max)
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
