<template>
  <el-radio-group
    v-model="modelValue"
    @change="handleRadioGroupChange"
    class="radio-group"
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
  >
    <el-radio v-for="item in options" :key="item.value" :value="item.value">
      <el-tooltip v-if="item.tip" class="item right" effect="dark" placement="top">
        <template #content>
          <div v-html="item.tip"></div>
        </template>
        <span>{{ item.label }} <i-ep-questionFilled /></span>
      </el-tooltip>
      <template v-else-if="item.labelType === 'array'">
        <span
          class="span"
          v-for="(label, index) in item.label"
          :key="index"
          :class="[item.labelClasses && item.labelClasses[index], item.labelClass]"
          >{{ label }}</span
        >
      </template>
      <span class="span" :class="item.labelClass" v-else>{{ item.label }}</span>
    </el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const modelValue = ref(props.formConfig.value || props.formConfig.defaultValue)
const options = computed(
  () => (Array.isArray(props.formConfig?.options) && props.formConfig?.options) || []
)

const handleRadioGroupChange = (value: string) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

watch(
  props.formConfig,
  (config) => {
    if (config.value == null || config.value == undefined) {
      modelValue.value = config.defaultValue
      return
    }

    modelValue.value = config.value
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<style lang="scss" scoped>
.star-radio-wrapper {
  margin-left: 28px;
  height: 45px;

  &.no-margin {
    margin-left: 0;
  }
}

.option-list-width {
  max-width: 400px;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
}

.span {
  margin-right: 4px;
}

.span {
  white-space: pre-wrap;
  color: #6e707c !important;
}
</style>
