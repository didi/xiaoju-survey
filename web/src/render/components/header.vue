<template>
  <div class="question-header">
    <div
      class="banner"
      v-if="bannerConf.bannerConfig && bannerConf.bannerConfig.bgImage"
    >
      <img
        class="banner-img"
        :src="bannerConf.bannerConfig.bgImage"
        :class="{ pointer: bannerConf.bannerConfig.bgImageAllowJump }"
        @click="onBannerClick"
      />
    </div>
    <div
      class="banner"
      v-if="bannerConf.bannerConfig && bannerConf.bannerConfig.videoLink"
    >
      <div class="video">
        <video
          id="video"
          controls
          style="margin: 0 auto; width: 100%; display: block"
          preload="auto"
          :poster="bannerConf.bannerConfig.postImg"
        >
          <source :src="bannerConf.bannerConfig.videoLink" type="video/mp4" />
        </video>
        <div
          class="video-modal"
          :style="`background-image:url(${bannerConf.bannerConfig.postImg})`"
        ></div>
        <div class="iconfont icon-kaishi play-icon" @click="play()"></div>
      </div>
    </div>
    <div
      class="titlePanel"
      v-if="bannerConf.titleConfig && bannerConf.titleConfig.mainTitle"
    >
      <div
        class="mainTitle"
        v-if="bannerConf.titleConfig.mainTitle"
        v-safe-html="bannerConf.titleConfig.mainTitle"
      ></div>
    </div>
  </div>
</template>
<script>
import { get as _get } from 'lodash-es';
import { formatLink } from '../utils/index.js';

export default {
  name: 'TheHeader',
  computed: {
    bannerConf() {
      return _get(this.$store, 'state.bannerConf', {});
    },
  },
  methods: {
    onBannerClick() {
      const allow = _get(
        this.bannerConf,
        'bannerConfig.bgImageAllowJump',
        false
      );
      const jumpLink = _get(
        this.bannerConf,
        'bannerConfig.bgImageJumpLink',
        ''
      );
      if (!allow || !jumpLink) {
        return;
      }
      window.open(formatLink(jumpLink));
    },
    play() {
      const video = document.getElementById('video');
      document.querySelector('.play-icon').style.display = 'none';
      document.querySelector('.video-modal').style.display = 'none';
      video.play();
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.question-header {
  .banner,
  .titlePanel {
    position: relative;
    width: 100%;
  }

  .banner {
    .banner-img {
      width: 100%;

      &.pointer {
        cursor: pointer;
      }
    }
  }

  .titlePanel {
    padding: 0.4rem 0.4rem;
    box-sizing: border-box;
  }

  .video {
    width: 100%;
    height: 100%;
  }

  .video-modal {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 100;
  }

  .play-icon {
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    font-size: 1.8rem;
    left: 50%;
    top: 49%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 101;
  }
}
</style>

<style lang="scss">
@import '@/render/styles/variable.scss';

.mainTitle {
  font-size: 0.28rem;
  line-height: 0.4rem;
  color: $title-color;

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  img {
    width: 100%;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    line-height: 0.6rem;
    color: $title-color-deep;
    margin-bottom: 0.35rem;
  }
  p {
    margin-bottom: 0;
  }
}
</style>
