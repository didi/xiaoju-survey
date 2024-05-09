<template>
  <div class="main-operation">
    <div class="operation-wrapper">
      <div class="box" ref="box">
        <div class="mask"></div>
        <BannerContent :bannerConf="bannerConf" />
        <div class="content">
          <MainTitle :isSelected="false" :bannerConf="bannerConf" />
          <MaterialGroup :questionDataList="questionDataList" ref="MaterialGroup" />
          <SubmitButton
            :submit-conf="submitConf"
            :skin-conf="skinConf"
            :is-selected="currentEditOne === 'submit'"
          />
          <LogoPreview :logo-conf="bottomConf" :is-selected="currentEditOne === 'logo'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'
import BannerContent from '../components/BannerContent.vue'
import MainTitle from '@/management/pages/edit/components/MainTitle.vue'
import SubmitButton from '@/management/pages/edit/components/SubmitButton.vue'
import LogoPreview from '@/management/pages/edit/components/LogoPreview.vue'
import { mapState, mapGetters } from 'vuex'
import { get as _get } from 'lodash-es'

export default {
  name: 'PreviewPanel',
  components: {
    BannerContent,
    MainTitle,
    SubmitButton,
    LogoPreview,
    MaterialGroup
  },
  data() {
    return {
      isAnimating: false
    }
  },
  computed: {
    ...mapState({
      bannerConf: (state) => _get(state, 'edit.schema.bannerConf'),
      submitConf: (state) => _get(state, 'edit.schema.submitConf'),
      bottomConf: (state) => _get(state, 'edit.schema.bottomConf'),
      skinConf: (state) => _get(state, 'edit.schema.skinConf'),
      questionDataList: (state) => _get(state, 'edit.schema.questionDataList'),
      currentEditOne: (state) => _get(state, 'edit.currentEditOne')
    }),
    ...mapGetters({
      currentEditKey: 'edit/currentEditKey'
    })
  },
  watch: {
    skinConf: {
      handler(skinConf) {
        const { themeConf, backgroundConf, contentConf } = skinConf
        const root = document.documentElement
        if (themeConf?.color) {
          root.style.setProperty('--primary-color', themeConf?.color) // 设置主题颜色
        }
        if (backgroundConf?.color) {
          root.style.setProperty('--primary-background-color', backgroundConf?.color) // 设置背景颜色
        }
        if (contentConf?.opacity.toString()) {
          root.style.setProperty('--opacity', contentConf?.opacity / 100) // 设置全局透明度
        }
      },
      immediate: true, // 立即触发回调函数
      deep: true
    }
  },
  methods: {
    animate(dom, property, targetValue) {
      const origin = dom[property]
      const subVal = targetValue - origin

      const flag = subVal < 0 ? -1 : 1

      const step = flag * 50

      const totalCount = Math.floor(subVal / step) + 1

      let runCount = 0
      const run = () => {
        dom[property] += step
        runCount++
        if (runCount < totalCount) {
          requestAnimationFrame(run)
        } else {
          this.isAnimating = false
        }
      }

      requestAnimationFrame(run)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-operation {
  width: 100%;
  height: 100%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f9;
}

.toolbar {
  width: 100%;
  height: 38px;
  background-color: #fff;
  flex-grow: 0;
  flex-shrink: 0;
}

.operation-wrapper {
  margin-top: 50px;
  margin-bottom: 45px;
  // min-height: 812px;
  overflow-x: hidden;
  overflow-y: auto;
  // padding-right: 30px;
  margin-right: 0px;
  scrollbar-width: none;
  width: 90%;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .box {
    background-color: var(--primary-background-color);
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }
    .content {
      margin: 0 0.3rem;
      background: rgba(255, 255, 255, var(--opacity));
      border-radius: 8px 8px 0 0;
    }
  }
}
</style>
