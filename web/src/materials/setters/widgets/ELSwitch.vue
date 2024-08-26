<template>
  <el-switch
    v-model="modelValue"
    class="ml-2"
    active-text="是"
    inactive-text="否"
    @change="handleInputChange"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
  moduleConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: boolean }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()
const modelValue = ref(props.formConfig.value)

const handleInputChange = (value: boolean) => {
  const key = props.formConfig.key

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

  