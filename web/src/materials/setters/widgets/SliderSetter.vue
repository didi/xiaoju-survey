<template>
  <el-form-item class="slider-wrap">
    <el-slider
      :modelValue="formConfig.value"
      @input="handleSliderChange"
      :format-tooltip="formatTooltip"
    ></el-slider>
  </el-form-item>
</template>
<script setup lang="ts">
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const formatTooltip = (val: string) => val + '%'

const handleSliderChange = (value: number) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
</script>
<style>
.slider-wrap {
  flex: 1;
  padding: 0 20px;
}
</style>
