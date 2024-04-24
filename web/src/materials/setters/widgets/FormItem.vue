<template>
  <el-form-item
    :class="{
      // horizon: formConfig.direction === 'horizon',
      // space_between: formConfig.direction === 'space_between'
    }"
  >
    <template #label v-if="formConfig.label">
      <div v-if="formConfig.label" class="item-label" :style="formConfig.labelStyle">
        <span class="label" v-plain-text="formConfig.label"><i-ep-questionFilled /></span>

        <el-tooltip
          v-if="formConfig.tip"
          class="tooltip"
          :content="formConfig.tip"
          :placement="formConfig.placement || 'right'"
        >
          <i-ep-questionFilled class="icon-tip" />
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
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
// .horizon {
//   // display: flex;
//   // flex-direction: row;
//   margin-bottom: 18px;
// }
// .space_between {
//   // display: flex;
//   // justify-content: space-between;

//   // :deep(> el-form-item__label) {
//   //   flex: 1;
//   //   margin-bottom: 0;
//   // }
//   // :deep(> div){
//   //   flex: 1;
//   // }
// }
// :deep(.customed-label) {
//   display: flex;
//   align-items: center;
//   height: 100%;
// }

.item-label {
  align-items: center;
  display: flex;
}

.icon-tip {
  font-size: 13px;
  color: #606266;
}
</style>
