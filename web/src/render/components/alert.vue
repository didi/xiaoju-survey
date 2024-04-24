<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="title">{{ title }}</div>
      <div class="btn" @click="onConfirm">{{ btnText }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AlertSetter',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '我知道了'
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    onConfirm() {
      this.$emit('confirm')
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../styles/dialog.scss');

.btn {
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 42px;
  margin-top: 20px;
  line-height: 42px;
  border-radius: 2px;
  font-size: 16px;
  background-color: #4a4c5b;
  border: 1px solid #4a4c5b;
  color: #fff;
  cursor: pointer;
}
</style>
