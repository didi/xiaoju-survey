<template>
  <div>
    <el-select 
      :multiple="multiple"
      v-model="value" 
      placeholder="Select"
      style="width: 120px;"
      @change="handleChange">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { type Ref, ref, computed, defineProps, watch } from 'vue'
import { type ListItem } from '@/management/utils/types/workSpace'

const props = withDefaults(defineProps<{
  multiple?: boolean,
  modelValue: string | string[],
  options: ListItem[]
}>(), {
  multiple: false,
  modelValue: '',
  options: () => []
})
const emit = defineEmits(['update:modelValue', 'change'])
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
})
const handleChange = (val: string | string[]) => {
  console.log({val})
  emit("change", val)
}

const currentValue: Ref<string | string[]> = ref(props.multiple ? [] : '')
watch(() => props.modelValue, (newValue) => {
  currentValue.value = newValue
})
</script>
