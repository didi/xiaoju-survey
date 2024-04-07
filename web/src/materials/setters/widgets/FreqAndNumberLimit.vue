<template>
  <el-form-item>
    <el-select
      class="option-select"
      placeholder="请选择"
      :value="formConfig.value[formConfig.selectKey]"
      @change="onChange($event, formConfig.selectKey)"
    >
      <el-option
        v-for="item in formConfig.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <template v-if="isShowNumberFn">
      <span class="option-txt">提交</span>
      <el-input-number
        v-model="numberValue"
        @change="onChange($event, formConfig.numberKey)"
      ></el-input-number>
      <span class="option-txt">次</span>
    </template>
  </el-form-item>
</template>
<script>
import { get as _get } from 'lodash-es';
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'FreqAndNumberLimit',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isShowNumberFn() {
      return !!this.formConfig.value[this.formConfig.selectKey];
    },
  },
  data() {
    return {
      numberValue: Number(
        _get(this.formConfig.value, this.formConfig.numberKey, 0)
      ),
    };
  },
  methods: {
    onChange(e, key) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value: e,
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.option-select {
  width: 130px !important;
}
.option-txt {
  margin: 0 10px;
}
</style>
