<template>
  <el-form-item class="slider-wrap">
    <el-slider :value="formConfig.value" @input="changeData" :format-tooltip="formatTooltip"></el-slider>
    <!-- <span>{{ formConfig.value + '%'  }}</span> -->
  </el-form-item>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'SliderSetter',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatTooltip (val) {
      return val + '%';
    },
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
<style>
.slider-wrap{
  flex: 1;
  /* display: flex; */
  padding: 0 20px;
}
</style>