<template>
  <div class="range-wrapper">
    <el-input-number :modelValue="minValue" @change="changeDataMin" :min="0" />
    <span class="split-text">至</span>
    <el-input-number :modelValue="maxValue" @change="changeDataMax" :min="0" />
  </div>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
export default {
  name: 'RangeSetter',
  props: {
    formConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    minValue() {
      if (this.formConfig.key === 'textRange') {
        return parseInt(this.formConfig?.value?.min?.value)
      } else {
        return this.formConfig?.value?.min?.value || 1
      }
    },
    maxValue() {
      if (this.formConfig.key === 'textRange') {
        return parseInt(this.formConfig?.value?.max?.value)
      } else {
        return this.formConfig?.value?.max?.value || 1
      }
    }
  },
  methods: {
    changeDataMin(value) {
      const key = this.formConfig.key
      if (value > this.formConfig.value.max.value) {
        this.$message({
          type: 'info',
          message: '最小值大于最大值，请重新输入！'
        })
      } else {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key: key + '.min.value',
          value
        })
      }
    },
    changeDataMax(value) {
      const key = this.formConfig.key
      if (value < this.formConfig.value.min.value) {
        this.$message({
          type: 'info',
          message: '最大值小于最小值，请重新输入！'
        })
      } else {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key: key + '.max.value',
          value
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.range-wrapper {
  .el-input-number {
    width: 40%;
  }

  .split-text {
    font-size: 14px;
    padding: 0 15px;
    color: #6e707c;
  }
}
</style>
