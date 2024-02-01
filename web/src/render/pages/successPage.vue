<template>
  <div class="result-page">
    <div class="result-content">
      <img src="/imgs/icons/success.webp" />
      <div class="msg" v-safe-html="successMsg"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'resultPage',
  computed: {
    submitConf() {
      return this.$store?.state?.submitConf || {};
    },
    successMsg() {
      return this.submitConf?.msgContent?.msg_200 || '提交成功';
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '@/render/styles/variable.scss';

.result-page {
  width: 100%;
  flex: 1;
  text-align: center;
  overflow: hidden;
}

.result-content {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  position: relative;
  padding-top: 2rem;
  background: #fff;

  img {
    width: 2rem;
  }

  .msg {
    font-size: 0.32rem;
    color: #4a4c5b;
    letter-spacing: 0;
    text-align: center;
    font-weight: 500;
    margin-top: 0.15rem;
  }
}
</style>
