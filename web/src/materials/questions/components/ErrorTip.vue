<template>
  <div :class="['module-err-tip', !!msg ? 'show' : '']">
    <p class="tip-text">
      <span class="qicon qicon-tishi"></span>
      <span class="err-msg">{{ msg }}</span>
    </p>
  </div>
</template>
<script>
export default {
  name: 'ModuleErrTip',
  data() {
    return {};
  },
  props: {
    msg: String,
  },
  methods: {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import '@/render/styles/default.scss';

.module-err-tip {
  color: $error-color;
  padding: 0 0.4rem;
  position: relative;
  overflow: hidden;

  .tip-text {
    width: 100%;
    font-size: 0.22rem;
    line-height: 0.3rem;
    padding: 0.16rem 0 0.2rem 0;
  }

  .qicon-tishi {
    font-size: 0.2rem;
    color: red;
    padding-right: 0.1rem;
  }

  &:not(.show) {
    display: block;
    opacity: 0;
    height: 0;

    .qicon-tishi {
      font-size: 0;
      color: transparent;
      padding-right: 0.1rem;
    }

    transition: all 0.3s ease-in-out;
  }

  &.show {
    display: block;
    opacity: 1;
    min-height: 0.4rem;
    transition: all 0.3s ease-in-out;
  }
}
</style>
