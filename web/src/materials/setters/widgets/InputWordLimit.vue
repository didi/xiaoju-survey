<template>
  <el-input
      :maxlength="maxlength"
      v-model="modelValue"
      :placeholder="placeholder"
      show-word-limit
      type="text"
      @change="handleInputChange"
  />
</template>
<script setup>
import {  computed,ref } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])

const modelValue = ref(props.formConfig.value || '')

const maxlength = computed(() => props.formConfig.maxlength || 10)

const placeholder = computed(() => props.formConfig.placeholder || '')

const handleInputChange = (value) => {
  const key = props.formConfig.key

  modelValue.value = value

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

</script>