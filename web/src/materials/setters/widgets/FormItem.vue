<template>
  <el-form-item>
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
.item-label {
  align-items: center;
  display: flex;
}

.icon-tip {
  font-size: 13px;
  color: #606266;
}
</style>
