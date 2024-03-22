<template>
  <el-form-item
    :class="{
      horizon: formConfig.direction === 'horizon',
      space_between: formConfig.direction === 'space_between',
    }"
  >
    <slot name="before"></slot>
    <div
      v-if="formConfig.label"
      slot="label"
      class="customed-label"
      :style="formConfig.labelStyle"
    >
      <span class="label" v-plain-text="formConfig.label"></span>
      <el-tooltip
        v-if="formConfig.tip"
        class="tooltip"
        effect="dark"
        :placement="formConfig.placement || 'right'"
      >
        <div slot="content" v-plain-text="formConfig.tip"></div>
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
    <slot></slot>
  </el-form-item>
</template>
<script>
export default {
  name: 'FormItem',
  components: {},
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.horizon {
  display: flex;
  flex-direction: row;
}
.space_between{
  display: flex;
  justify-content: space-between;
  
  ::v-deep> label{
    flex: 1;
  }
  ::v-deep> div{
    flex: 1;
  }
}
</style>
