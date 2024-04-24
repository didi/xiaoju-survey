<template>
  <div class="mask" v-show="visible">
    <div class="box">
      <div class="title">{{ title }}</div>
      <div class="btn-box">
        <div class="btn cancel" @click="onCancel">{{ cancelBtnText }}</div>
        <div class="btn confirm" @click="onConfirm">{{ confirmBtnText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfirmSetter',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    onCancel() {
      // this.$emit('cancel');
      this.$emit('close')
    },
    onConfirm() {
      this.$emit('confirm', () => {
        this.$emit('close')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../styles/dialog.scss');

.btn-box {
  padding: 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    width: 48%;
    font-size: 0.28rem;
    border-radius: 0.04rem;
    text-align: center;
    padding: 0.16rem 0;
    line-height: 0.4rem;
    cursor: pointer;

    &.cancel {
      background: #fff;
      color: #92949d;
      border: 1px solid #e3e4e8;
    }

    &.confirm {
      background-color: #4a4c5b;
      border: 1px solid #4a4c5b;
      color: #fff;
    }
  }
}
</style>
