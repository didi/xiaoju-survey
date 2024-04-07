<template>
  <el-input-number
    :placeholder="formConfig.placeholder"
    :value="numberValue"
    @change="changeData"
    :min="min"
    :max="max"
  />
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'InputNumber',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
    moduleConfig: {
      type: Object,
      required: true,
    },
    questionDataList: {
      type: Array,
    },
  },
  data() {
    return {
      numberValue: 0,
    };
  },
  watch: {
    'formConfig.value': {
      immediate: true,
      handler(newVal) {
        const val = parseInt(newVal || '0');
        if (val === this.numberValue) {
          return;
        }
        this.numberValue = val;
      },
    },
  },
  computed: {
    min() {
      const { min } = this.formConfig;
      const { type } = this.moduleConfig;
      if (min !== undefined) {
        if (typeof min === 'string') {
          return this.judgeType(type)
            ? Number(this.moduleConfig[min])
            : Number(Number(this.moduleConfig[min]) + 1);
        } else if (typeof this.formConfig.min === 'function') {
          return min(this.moduleConfig);
        } else {
          return Number(min);
        }
      }
      return -Infinity;
    },
    max() {
      const { type } = this.moduleConfig;
      const { max, min } = this.formConfig;

      if (max) {
        if (typeof max === 'string') {
          return this.judgeType(type)
            ? Number(this.moduleConfig[max])
            : this.moduleConfig[max] - 1;
        } else if (typeof max === 'function') {
          return max(this.moduleConfig);
        }
        return Number(max);
      } else if (
        min !== undefined &&
        Array.isArray(this.moduleConfig?.options)
      ) {
        // inputNumber 配置了最小值，没有配置最大值（checkbox, vote, matrix-checkbox, 最大选择数 ）
        return this.moduleConfig.options.length;
      } else {
        return Infinity;
      }
    },
  },
  methods: {
    judgeType(type) {
      return ['checkbox', 'vote'].includes(type);
    },
    changeData(value) {
      const reg = /^(-)?[0-9]+$/;
      if (!reg.test(value)) {
        this.$message.warning('只能输入整数');
      }
      this.numberValue = value;
      const key = this.formConfig.key;
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value,
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.star-form.star-form_horizon {
  .star-form-label + .el-form-item {
    margin-left: 0px;
  }
}

.wrapper {
  .remark {
    color: red;
    margin-bottom: 10px;
    display: block;
    font-size: 12px;
  }
}
</style>
