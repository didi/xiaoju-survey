<template>
  <div class="default-empty-root">
    <img class="img" :src="data.img" />
    <div class="title">{{ data.title }}</div>
    <div class="desc" v-html="data.desc" />
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.default-empty-root {
  width: 350px;
  margin: 200px auto;
  .img {
    height: 120px;
    display: block;
    margin: auto;
  }
  .title {
    color: $normal-color-deep;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    margin-top: 20px;
  }
  .desc {
    color: $normal-color;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    margin-top: 8px;
    .link {
      color: $sub-color;
    }
  }
}
</style>
