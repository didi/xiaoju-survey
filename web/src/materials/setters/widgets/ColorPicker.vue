<template>
  <el-form-item class="pick-wrap">
    <el-color-picker
      :modelValue="formConfig.value"
      @change="handleColorPickerChange"
    ></el-color-picker>
  </el-form-item>
</template>
<script setup lang="ts">
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const handleColorPickerChange = (value: string) => {
  const key = props.formConfig.key
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
</script>
<style lang="scss" scoped>
.pick-wrap {
  width: 100%;

  :deep(.el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
