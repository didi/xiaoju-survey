<template>
  <Component
    :is="advancedComponent"
    :fieldId="editStore.moduleConfig.field"
    @handleChange="handleChange"
  />
</template>
<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'
import { QUESTION_TYPE } from '@/common/typeEnum'

import { useEditStore } from '@/management/stores/edit'

const editStore = useEditStore()

const emit = defineEmits(['handleChange'])

const props = defineProps({
  moduleConfig: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const advancedComponent = shallowRef(null)

const handleChange = (data) => {
  emit('handleChange', data)
}

// 题型组件的高级设置
switch (props.moduleConfig.type) {
  case QUESTION_TYPE.RADIO:
  case QUESTION_TYPE.CHECKBOX:
  case QUESTION_TYPE.VOTE:
    advancedComponent.value = defineAsyncComponent(() => import('./OptionConfig.vue'))
    break
  case QUESTION_TYPE.RADIO_STAR:
  case QUESTION_TYPE.RADIO_NPS:
    advancedComponent.value = defineAsyncComponent(() => import('./RateConfig.vue'))
    break
  default:
    break
}
</script>
<style lang="scss" scoped></style>
