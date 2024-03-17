<template>
  <div class="banner-wrap" @click="handleClick('banner')">
    <div class="banner" v-if="bgImage">
      <img :src="bgImage" />
    </div>
    <div v-else :class="{ 'empty-banner': true, 'banner-active': isSelected }">
      <p>点击配置头图</p>
      <p>若不配置头图，将不在问卷中展示</p>
    </div>
    <div class="banner" v-if="bannerConf.bannerConfig.videoLink">
      <div class="video">
        <video
          class="custom-video"
          :poster="bannerConf.bannerConfig.postImg"
          preload="auto"
          controls
          :src="bannerConf.bannerConfig.videoLink"
        ></video>
      </div>
    </div>
  </div>
</template>
<script>
import { get as _get } from 'lodash-es';

export default {
  name: 'banner',
  data() {
    return {};
  },
  props: {
    bannerConf: {
      type: Object,
    },
    isSelected: {
      type: Boolean,
    },
  },
  computed: {
    bgImage() {
      return _get(this.bannerConf, 'bannerConfig.bgImage', '');
    },
  },
  methods: {
    handleClick() {
      this.$emit('select');
    },
  },
  components: {},
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.banner-preview {
  width: 100%;
}

.banner-wrap {
  width: 100%;

  .banner {
    width: 100%;

    img {
      width: 100%;
    }

    .custom-video {
      margin: 0 auto;
      width: 100%;
      display: block;
    }
  }

  .empty-banner {
    height: 120px;
    border: 1px dashed #e3e4e8;

    p {
      text-align: center;
      color: #c8c9cd;
      font-size: 16px;
      &:first-child {
        font-size: 24px;
        color: #92949d;
        margin: 20px 0 24px 0;
      }
    }

    &.banner-active {
      background-color: #f2f4f7;
      box-shadow: 0 0 5px #e3e4e8;
    }
  }
}

.title-wrapper {
  padding: 15px;
}

.main-title {
  border: 1px solid transparent;

  &.active {
    border: 1px solid #e3e4e6;
    background-color: #f6f7f9;
    box-shadow: 0 0 5px #dedede;

    ::v-deep .w-e-text-container {
      background-color: #f6f7f9;
    }
  }
}

.main-title:hover {
  border: 1px dashed #eee;
}
</style>
