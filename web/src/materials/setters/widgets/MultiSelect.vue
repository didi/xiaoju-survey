<template>
  <el-select
    :placeholder="placeholder"
    :value="modelValue"
    @change="handleSelectChange"
    multiple
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
  >
    <el-option
      v-for="item in options"
      :label="item.label"
      :title="item.label"
      :value="item.value"
      :key="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { cleanRichText } from '@/common/xss'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: Array<string> }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const modelValue = ref([])
const placeholder = computed(() => props.formConfig.placeholder || props.formConfig.label)
const options = computed(() => {
  if (!Array.isArray(props.formConfig?.options)) {
    return []
  }

  return props.formConfig?.options.map((item: any) => {
    item.label = cleanRichText(item.label)
    return item
  })
})

const handleSelectChange = (value: Array<string>) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
</script>
<style lang="scss" scoped>
.select-wrapper {
  .el-select-dropdown__item {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
  }
}

.option-list-width {
  max-width: 400px;
}

.el-select .el-tag {
  max-width: 150px;

  .el-select__tags-text {
    display: inline-block;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 19px;
  }

  .el-tag__close {
    right: -9px;
    top: -5px;
  }
}
</style>
