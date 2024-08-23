<template>
  <el-input
    :placeholder="formConfig.placeholder"
    v-model="modelValue"
    :maxlength="formConfig.maxLength"
    @blur="handleInputBlur"
  ></el-input>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const modelValue = ref(props.formConfig.value || '')

const handleInputBlur = () => {
  const { key, validate, value } = props.formConfig
  const preValue = value || ''

  if (validate && typeof validate == 'function') {
    const validateResult: boolean = validate(modelValue.value)

    if (!validateResult) {
      return
    }
  }

  if (preValue !== modelValue.value) {
    emit(FORM_CHANGE_EVENT_KEY, { key, value: modelValue.value })
  }
}

watch(
  () => props.formConfig.value,
  (value) => {
    if (value !== modelValue.value) {
      modelValue.value = value
    }
  }
)
</script>
