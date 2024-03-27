<template>
  <el-input
    class="custom-input"
    :placeholder="formConfig.placeholder"
    v-model="value"
    @input="changeData"
    :min="min"
    :max="max"
    type="number"
  >
    <template slot="append">%</template>
  </el-input>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'InputPercent',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: '',
    };
  },
  watch: {
    'formConfig.value': {
      immediate: true,
      handler(newVal) {
        let val = parseFloat(newVal);
        if (val === this.value) {
          return;
        }
        this.value = val;
      },
    },
  },
  computed: {
    max() {
      let max = parseFloat(this.formConfig.max);
      if (isNaN(max)) {
        max = 100;
      }
      return max;
    },
    min() {
      let min = parseFloat(this.formConfig.min);
      if (isNaN(min)) {
        min = 0;
      }
      return min;
    },
  },
  methods: {
    changeData() {
      const key = this.formConfig.key;
      let value = parseFloat(this.value);
      value = Math.max(value, this.min);
      value = Math.min(value, this.max);
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value: `${value}%`,
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.custom-input{
  ::v-deep .el-input__inner{
    width: 100px;
    padding-right: 0px;
  }
}

</style>
