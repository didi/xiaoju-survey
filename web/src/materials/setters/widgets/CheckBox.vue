<template>
  <el-checkbox
    v-model="modelValue"
    @change="handleCheckboxChange"
    :class="{ inline: !!formConfig?.inline }"
  >
  </el-checkbox>
</template>
<script setup lang="ts">
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


const handleCheckboxChange = (value: boolean) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

watch(
  () => props.formConfig.value,
  (newVal: boolean) => {
    if (newVal !== modelValue.value) {
      modelValue.value = !!newVal
    }
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.inline {
  width: 140px;
}
</style>
