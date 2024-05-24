<template>
  <el-form-item>
    <el-input
      v-model="modelValue"
      :placeholder="formConfig.placeholder"
      :maxlength="formConfig.maxlength"
      @change="handleInputChange"
    >
      <template #prepend>#</template>
    </el-input>
  </el-form-item>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const modelValue = ref(props.formConfig.value)

const handleInputChange = (value: string) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
</script>
