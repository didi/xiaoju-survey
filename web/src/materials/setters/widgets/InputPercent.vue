<template>
  <el-input
    class="custom-input"
    :placeholder="formConfig.placeholder"
    v-model="modelValue"
    @change="handleInputChange"
    :min="minModelValue"
    :max="maxModelValue"
    type="number"
  >
    <template #append>%</template>
  </el-input>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const modelValue = ref(parseFloat(props.formConfig.value))
const maxModelValue = computed(() => parseFloat(props.formConfig.max) || 100)
const minModelValue = computed(() => parseFloat(props.formConfig.min) || 0)

const handleInputChange = (val: string) => {
  const key = props.formConfig.key
  const value = Math.min(Math.max(parseFloat(val), minModelValue.value), maxModelValue.value)
  let percent = ''

  if (Number.isInteger(value)) {
    percent = `${value}%`
  }

  emit(FORM_CHANGE_EVENT_KEY, { key, value: percent })
}
</script>
<style lang="scss" scoped>
.custom-input {
  :deep(.el-input__inner) {
    width: 100px;
    padding-right: 0px;
  }
}
</style>
