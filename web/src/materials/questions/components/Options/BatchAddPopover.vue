<template>
  <el-popover
    class="mypopover"
    placement="right"
    width="440"
    v-model:visible="visible"
    trigger="click"
  >
    <div class="mypopover-body">
      <div class="mypopover-body-header">
        <div class="mypopover-body-header-title">
          {{ title }}
        </div>
        <div class="mypopover-body-header-desc" v-if="desc">
          {{ desc }}
        </div>
      </div>
      <el-input type="textarea" rows="7" v-model="myValue"></el-input>
      <div class="mypopover-body-footer">
        <el-button size="mini" type="text" @click="handleClose">取消</el-button>
        <el-button type="primary" size="mini" @click="handleConfirm"
          >确定</el-button
        >
      </div>
    </div>
    <slot name="reference" slot="reference"></slot>
  </el-popover>
</template>
<script>
export default {
  props: {
    title: String,
    desc: String,
  },
  data() {
    return {
      visible: false,
      myValue: '',
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.$emit('cancel');
    },
    handleConfirm() {
      this.visible = false;
      this.$emit('confirm', this.myValue);
      // 清空值
      this.myValue = '';
    },
  },
};
</script>
<style lang="scss">
.mypopover {
  &-body {
    padding: 0px 5px;
    &-header {
      padding: 5px 0;
      text-align: left;
      line-height: 30px;
      &-title {
        font-size: 14px;
        color: #1f1f1f;
      }
      &-desc {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
    &-footer {
      padding: 5px 0;
      text-align: right;
      margin-top: 10px;
    }
  }
}
</style>
