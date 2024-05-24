<template>
  <div class="question-header">
    <div class="banner" v-if="bannerConf.bannerConfig && bannerConf.bannerConfig.bgImage">
      <img
        class="banner-img"
        :src="bannerConf.bannerConfig.bgImage"
        :class="{ pointer: bannerConf.bannerConfig.bgImageAllowJump }"
        @click="handleBannerClick"
      />
    </div>
    <div class="banner" v-if="bannerConf.bannerConfig && bannerConf.bannerConfig.videoLink">
      <div class="video">
        <video
          ref="videoRef"
          controls
          style="margin: 0 auto; width: 100%; display: block"
          preload="auto"
          :poster="bannerConf.bannerConfig.postImg"
        >
          <source :src="bannerConf.bannerConfig.videoLink" type="video/mp4" />
        </video>
        <div
          class="video-modal"
          :style="{
            backgroundImage:
              bannerConf.bannerConfig.postImg && `url(${bannerConf.bannerConfig.postImg})`,
            display: displayModel
          }"
        ></div>
        <div
          class="iconfont icon-kaishi play-icon"
          :style="{ display: displayModel }"
          @click="handlePlay()"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { get as _get } from 'lodash-es'

import { formatLink } from '../utils/index.js'

const store = useStore()

const bannerConf = computed<any>(() => _get(store, 'state.bannerConf', {}))

const handleBannerClick = () => {
  const allow = _get(bannerConf.value, 'bannerConfig.bgImageAllowJump', false)
  const jumpLink = _get(bannerConf.value, 'bannerConfig.bgImageJumpLink', '')

  if (!allow || !jumpLink) {
    return
  }

  window.open(formatLink(jumpLink))
}

const videoRef = ref<HTMLVideoElement | null>(null)
const displayModel = ref('block')

const handlePlay = () => {
  if (bannerConf.value.bannerConfig && bannerConf.value.bannerConfig.videoLink) {
    videoRef.value?.play()
    displayModel.value = 'none'
  }
}
</script>
<style lang="scss" scoped>
.question-header {
  .banner,
  .titlePanel {
    position: relative;
    width: 100%;
  }

  .banner {
    display: flex;
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
