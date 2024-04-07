<template>
  <div
    class="process-outer"
    :style="{
      width: processConf.width || 'auto',
      height: processConf.height || '0.03rem',
    }"
  >
    <div
      class="process-inner"
      :style="{
        width: processConf.percent || 0,
      }"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'ProcessModule',
  props: {
    /*
        @ width: 进度条总长度
        @ percent: 进度条进度
        */
    processConf: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {
    calcVotePercent(option) {
      const { voteCount = 0, voteTotal = 0 } = option;
      if (voteTotal === 0) {
        return '0.0';
      }
      return ((voteCount * 100) / voteTotal).toFixed(1);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '../common/css/default.scss';
.process-outer {
  position: relative;
  border-radius: 0.16rem;
  background: #f5f5f5;
  overflow: hidden;

  .process-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-radius: 0.16rem;
    background-color: $primary-color;
    transition: width 1s linear;
  }
}
</style>
