<template>
  <div class="back-btn" @click="onBack">
    <i class="iconfont icon-fanhui"></i>
    <span>返回</span>
  </div>
</template>

<script>
export default {
  name: 'back',
  methods: {
    onBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.back-btn {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  .iconfont {
    margin-right: 5px;
  }
}
</style>
