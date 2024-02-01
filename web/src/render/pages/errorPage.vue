<template>
  <div class="error-wrapper">
    <img class="error-img" :src="errorImageUrl" />
    <div class="bottom-word" v-html="errorMsg"></div>
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
