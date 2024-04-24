<template>
  <el-switch :modelValue="!!formConfig.value" @change="changeData" />
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
export default {
  name: 'CustomedSwitch',
  props: {
    formConfig: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeData(value) {
      const key = this.formConfig.key
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value
      })
    }
  }
}
</script>
