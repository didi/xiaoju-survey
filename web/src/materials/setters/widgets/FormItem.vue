<template>
  <el-form-item
    :class="{
      horizion: formConfig.direction === 'horizon',
      space_between: formConfig.direction === 'space_between',
    }"
  >
    <slot name="before"></slot>
    <template #label v-if="formConfig.label">
      <div
        v-if="formConfig.label"
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
          <template #content>
              <div v-plain-text="formConfig.tip"></div>
          </template>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
    </template>
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
</style>
