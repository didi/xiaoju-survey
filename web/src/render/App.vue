<template>
  <div id="app">
    <Component v-if="$store.state.router" :is="$store.state.router"></Component>
    <LogoIcon v-if="!['successPage', 'indexPage'].includes($store.state.router)" />
  </div>
</template>

<script>
import { getPublishedSurveyInfo } from './api/survey'
import useCommandComponent from './hooks/useCommandComponent'

import EmptyPage from './pages/EmptyPage.vue'
import IndexPage from './pages/IndexPage.vue'
import ErrorPage from './pages/ErrorPage.vue'
import SuccessPage from './pages/SuccessPage.vue'
import AlertDialog from './components/AlertDialog.vue'

import LogoIcon from './components/LogoIcon.vue'
import { get as _get } from 'lodash-es'
import { initRuleEngine } from '@/render/hooks/useRuleEngine.js'

export default {
  name: 'App',
  components: {
    EmptyPage,
    IndexPage,
    ErrorPage,
    SuccessPage,
    LogoIcon
  },
  data() {
    return {}
  },
  computed: {
    skinConf() {
      return _get(this.$store, 'state.skinConf', {})
    }
  },
  watch: {
    skinConf(value) {
      this.setSkin(value)
    }
  },
  async created() {
    this.init()
    this.alert = useCommandComponent(AlertDialog)
  },
  beforeCreate() {},
  methods: {
    async init() {
      const surveyPath = location.pathname.split('/').pop()
      if (!surveyPath) {
        this.$store.commit('setRouter', 'EmptyPage')
      } else {
        try {
          const res = await getPublishedSurveyInfo({ surveyPath })
          if (res.code === 200) {
            const data = res.data
            const { bannerConf, baseConf, bottomConf, dataConf, skinConf, submitConf, logicConf } = data.code
            document.title = data.title
            const questionData = {
              bannerConf,
              baseConf,
              bottomConf,
              dataConf,
              skinConf,
              submitConf
            }
            this.setSkin(skinConf)
            this.$store.commit('setSurveyPath', surveyPath)
            this.$store.dispatch('init', questionData)
            initRuleEngine(logicConf?.showLogicConf)
            this.$store.dispatch('getEncryptInfo')
          } else {
            throw new Error(res.errmsg)
          }
        } catch (error) {
          console.log(error)
          this.alert({
            title: error.message || '获取问卷失败'
          })
        }
      }
    },
    setSkin(skinConf) {
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
    }
  }
}
</script>

<style lang="scss">
@import url('./styles/icon.scss');
@import url('../materials/questions/common/css/icon.scss');
@import url('./styles/reset.scss');

html {
  background: rgb(238, 238, 238);
}

#app {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 750px;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
}
</style>
