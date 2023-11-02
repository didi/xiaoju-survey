<template>
  <el-select
    :placeholder="
      ['matrixOptionsRely', 'optionOrigin'].includes(formConfig.key)
        ? '请选择'
        : formConfig.label
    "
    v-model="validValue"
    @change="changeData"
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
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
<script>
import { cleanRichText } from '@/common/xss';
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'Select',
  data() {
    return {
      validValue: this.formConfig.value || '',
    };
  },
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  watch: {
    formConfig: {
      handler(v) {
        this.validValue = v.value;
      },
      deep: true,
    },
  },
  computed: {
    options() {
      let options = [];
      if (Array.isArray(this.formConfig?.options)) {
        options = this.formConfig?.options;
      }
      return options.map((item) => {
        item.label = cleanRichText(item.label);
        return item;
      });
    },
  },
  methods: {
    changeData(value) {
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
.option-list-width {
  max-width: 400px;
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
