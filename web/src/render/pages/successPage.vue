<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="result-content">
        <img src="/imgs/icons/success.webp" />
        <div class="msg" v-safe-html="successMsg"></div>
      </div>
      <logo></logo>
    </div>
  </div>
</template>
<script>
import logo from '../components/logo.vue';
export default {
  name: 'resultPage',
  components: {logo},
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

.result-page-wrap {
  width: 100%;
  flex: 1;
  text-align: center;
  overflow: hidden;
  background: var(--primary-background-color);
  
  padding: 0 0.3rem;
  .result-page{
    background: rgba(255, 255, 255, var(--opacity)); 
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.result-content {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  position: relative;
  padding-top: 2rem;
  flex: 1;

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
