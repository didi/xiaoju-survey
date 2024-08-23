<template>
  <el-checkbox
    v-model="modelValue"
    @change="handleCheckboxChange"
    :disabled="checkBoxDis"
    :class="{ inline: !!formConfig?.inline }"
  >
  </el-checkbox>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
const checkBoxDis = computed(
  () =>
    props.formConfig.key === 'randomSort' &&
    props.moduleConfig?.optionOrigin?.length > 0 &&
    props.moduleConfig?.extraOptions &&
    props.moduleConfig?.extraOptions?.length === 0
)

const handleCheckboxChange = (value: boolean) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

watch(
  () => props.moduleConfig.optionOrigin,
  (newVal) => {
    const key = props.formConfig.key
    const extraLen = props.moduleConfig?.extraOptions?.length

    if (key === 'randomSort' && newVal && extraLen === 0) {
      emit(FORM_CHANGE_EVENT_KEY, { key: 'randomSort', value: false })
      modelValue.value = false
    }
  }
)

watch(
  () => props.moduleConfig?.extraOptions?.length || [],
  (newVal) => {
    const key = props.formConfig.key
    const origin = props.moduleConfig?.optionOrigin

    if (key === 'randomSort' && origin && newVal === 0) {
      emit(FORM_CHANGE_EVENT_KEY, { key: 'randomSort', value: false })
      modelValue.value = false
    }
  }
)

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
