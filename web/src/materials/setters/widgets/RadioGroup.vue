<template>
  <el-radio-group
    v-model="modelValue"
    @change="handleRadioGroupChange"
    :disabled="formConfig.disabled"
  >
    <el-radio v-for="item in options" :key="item.value" :value="item.value" class="customed-radio">
      <el-tooltip v-if="item.tip" class="item right" effect="dark">
        <template #content>
          <div v-html="item.tip"></div>
        </template>
        <span>{{ item.label }} <i-ep-questionFilled /></span>
      </el-tooltip>
      <div v-else v-html="item.label"></div>
    </el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  () => ({
    value: props.formConfig?.value,
    defaultValue: props.formConfig?.defaultValue
  }),
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
.customed-radio {
  display: flex;
  margin-bottom: 10px;
}
</style>
