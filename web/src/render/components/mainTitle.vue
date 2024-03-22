<template>
  <div class="question-header">
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
export default {
  name: 'mainTitle',
  computed: {
    bannerConf() {
      return _get(this.$store, 'state.bannerConf', {});
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/render/styles/variable.scss';
.question-header {
  .titlePanel {
    position: relative;
    width: 100%;
    padding: 0.4rem 0.4rem;
    box-sizing: border-box;
  }
}
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
