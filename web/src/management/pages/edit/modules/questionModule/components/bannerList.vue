<template>
  <div class="banner-list-wrapper">
    <el-collapse v-model="curSkinGroupKey">
      <el-collapse-item
        v-for="(bannerGroup, index) in bannerList"
        :key="index"
        :title="bannerGroup.name"
        :name="bannerGroup.key"
      >
        <div
          class="single-banner-wrapper"
          v-for="(banner, bannerIndex) in bannerGroup.list"
          :key="bannerIndex"
        >
          <img
            class="banner-img"
            :src="banner.src"
            @click="changeBanner(banner.src)"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'bannerList',
  data() {
    return {
      curSkinGroupKey: ['temp'],
    };
  },
  computed: {
    bannerList() {
      return this.$store?.state?.bannerList || [];
    },
  },
  methods: {
    changeBanner(imgSrc) {
      this.$emit('change', imgSrc);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.banner-list-wrapper {
  padding: 5px 18px 100px 19px;
  overflow-x: hidden;

  .banner-img {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      -webkit-filter: brightness(90%);
      filter: brightness(90%);
    }
  }

  ::v-deep .el-collapse-item__header {
    font-size: 16px;
    color: $font-color-title;
    border-bottom: none;
  }

  ::v-deep .el-collapse-item__arrow.is-active {
    right: 0;
  }
  ::v-deep .el-collapse-item__arrow {
    right: 0;
  }
}
</style>
