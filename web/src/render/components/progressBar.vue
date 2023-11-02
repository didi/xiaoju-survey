<template>
  <div class="progress-outer">
    <div
      class="progress-inner"
      :style="{
        transition: 'all 0.5s',
        width: progressConf.precent || 0,
      }"
    ></div>
    <div class="progress-inner-wrapper-pc">
      <div
        class="progress-inner-pc"
        :style="{
          transition: 'all 0.5s',
          height: progressConf.precent || 0,
        }"
      ></div>
    </div>
    <div class="percent-pc">{{ progressConf.precent || '0%' }}</div>
  </div>
</template>
<script>
export default {
  name: 'ProgressBar',
  props: {
    progressConf: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.progress-outer {
  z-index: 10000;
  position: fixed;
  width: 100%;
  height: 2px;
  top: 0;
  background-color: #f5f5f5;
  overflow: hidden;
  .progress-inner {
    display: block;
    z-index: 10000;
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: $primary-color;
  }
  .progress-inner-wrapper-pc,
  .percent-pc {
    display: none;
  }
}
</style>
