<template>
  <el-select
    :placeholder="placeholder"
    v-model="modelValue"
    :empty-values="[null, undefined]"
    @change="handleSelectChange"
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
    :class="formConfig.contentClass"
  >
    <el-option
      v-for="item in options"
      :label="`${item.index ? item.index + '.' : ''}${item.label}`"
      :title="item.label"
      :value="item.value"
      :key="item.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import { computed, watch, ref } from 'vue'

import { cleanRichText } from '@/common/xss'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
  moduleConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const placeholder = computed(() => {
  const defaultValue = '请选择'

  if (!['matrixOptionsRely', 'optionOrigin'].includes(props.formConfig.key)) {
    return props.formConfig.label
  }

  return defaultValue
})

const options = computed(() => {
  if (!Array.isArray(props.formConfig?.options)) {
    return []
  }

  return props.formConfig?.options.map((item: any) => {
    item.label = cleanRichText(item.label)
    return item
  })
})

const modelValue = ref(
  !props.formConfig.value && props.formConfig.value != 0 ? '' : props.formConfig.value
)

const handleSelectChange = (value: string) => {
  const { key, validate } = props.formConfig

  if (validate && typeof validate == 'function') {
    let verification: boolean = validate(value, props.moduleConfig)

    if (!verification) {
      return
    }

    modelValue.value = props.moduleConfig[key]
  }
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

watch(
  () => props.formConfig?.value,
  (val) => {
    if (modelValue.value != val) {
      modelValue.value = val
    }
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.option-list-width {
  max-width: 400px;
}
.nps-select-config {
  width: 312px;
}
.select-option-quote,
.originType {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #6e607c;
  display: flex;
  justify-content: space-between;

  .option-quote-tip {
    margin-top: 6px;
    margin-right: 10px;
  }

  .origin-quote-tip {
    margin-top: 6px;
    margin-right: 24px;
  }

  .el-form-item {
    flex: 1;
  }

  &.originType {
    margin-top: -25px;
  }
}
</style>
