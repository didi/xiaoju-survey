<template>
  <el-form-item class="pick-wrap">
    <el-color-picker :modelValue="formConfig.value" @change="changeData"></el-color-picker>
  </el-form-item>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
export default {
  name: 'ColorPicker',
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
<style lang="scss" scoped>
.pick-wrap {
  width: 100%;

  :deep(.el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
