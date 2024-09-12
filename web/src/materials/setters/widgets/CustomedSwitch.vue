<template>
  <el-switch v-model="newValue" @change="changeData" />
</template>
<script setup>
import { ref, watch } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const props = defineProps({
  formConfig: {
    type: Object,
    required: true
  }
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])

const newValue = ref(props.formConfig.value)

const changeData = (value) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, {
    key,
    value
  })
}
watch(
  () => props.formConfig.value,
  (newVal) => {
    if (newVal !== newValue.value) {
      newValue.value = newVal
    }
  },
  {
    immediate: true
  }
)
</script>
