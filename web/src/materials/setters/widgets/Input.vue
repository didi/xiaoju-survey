<template>
  <el-input
    :placeholder="formConfig.placeholder"
    v-model="inputData"
    @blur="changeData"
  ></el-input>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';

export default {
  name: 'Input',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputData: this.formConfig.value || '',
    };
  },
  watch: {
    'formConfig.value': {
      handler(newVal) {
        if (newVal === this.inputData) {
          return;
        }
        this.inputData = newVal;
      },
    },
  },
  methods: {
    saveData(val) {
      this.inputData = val;
    },
    changeData: function () {
      let key = this.formConfig.key;
      if (this.formConfig.validate) {
        const validateResult = this.formConfig.validate(this.inputData);
        if (!validateResult) {
          return false;
        }
      }
      const preValue = this.formConfig.value || '';
      if (this.inputData === preValue) {
        return false;
      }
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value: this.inputData,
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>
