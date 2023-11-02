<template>
  <el-form-item>
    <el-input
      :placeholder="formConfig.placeholder"
      :value="formConfig.value"
      :maxLength="formConfig.maxlength"
      @change="changeData"
    >
      <template slot="prepend">#</template>
    </el-input>
  </el-form-item>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'ColorInput',
  props: {
    formConfig: {
      type: Object,
      required: true,
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
