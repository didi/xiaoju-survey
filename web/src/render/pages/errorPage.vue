<template>
  <div class="result-page-wrap">
    <div class="result-page">
      <div class="error-wrapper">
        <img class="error-img" :src="errorImageUrl" />
        <div class="bottom-word" v-html="errorMsg"></div>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  name: 'errorPage',
  data() {
    return {
      imageMap: {
        overTime: '/imgs/icons/overtime.webp',
      },
    };
  },
  computed: {
    errorImageUrl() {
      return this.imageMap[this.errorType] || this.imageMap.default;
    },
    errorType() {
      return this.$store.state?.errorInfo?.errorType;
    },
    errorMsg() {
      return this.$store.state?.errorInfo?.errorMsg;
    },
  },
  mounted() {},
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

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
.error-wrapper {
  text-align: center;
  font-size: 14px;
  flex: 1;

  p {
    text-align: center;
  }

  .error-img {
    margin-top: 2rem;
    margin-bottom: 30px;
    width: 2rem;
    height: auto;
  }

  .bottom-word {
    color: #999;
    margin-top: 10px;
  }
}
</style>
