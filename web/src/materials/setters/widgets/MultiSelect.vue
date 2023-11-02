<template>
  <el-select
    :placeholder="formConfig.placeholder || formConfig.label"
    :value="formConfig.value"
    @input="changeData"
    multiple
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
  >
    <el-option
      v-for="item in options"
      :label="item.label"
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
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
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
.select-wrapper {
  .el-select-dropdown__item {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
  }
}

.option-list-width {
  max-width: 400px;
}

.el-select .el-tag {
  max-width: 150px;

  .el-select__tags-text {
    display: inline-block;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 19px;
  }

  .el-tag__close {
    right: -9px;
    top: -5px;
  }
}
</style>
