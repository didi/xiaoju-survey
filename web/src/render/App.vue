<template>
  <div id="app">
    <Component v-if="$store.state.router" :is="$store.state.router"></Component>
    <logo v-if="!['successPage', 'indexPage'].includes($store.state.router)"></logo>
  </div>
</template>

<script>
import { getPublishedSurveyInfo } from './api/survey';

import emptyPage from './pages/emptyPage.vue';
import indexPage from './pages/index.vue';
import errorPage from './pages/errorPage.vue';
import successPage from './pages/successPage.vue';

import logo from './components/logo.vue';
import { get as _get, value } from 'lodash-es'

export default {
  name: 'App',
  components: {
    emptyPage,
    indexPage,
    errorPage,
    successPage,
    logo,
  },
  data() {
    return {};
  },
  computed: {
    skinConf () {
      return _get(this.$store, 'state.skinConf', {});
    },
  },
  watch: {
    skinConf(value) {
      this.setSkin(value)
    }
  },
  async created() {
    this.init();
  },
  beforeCreate() {},
  methods: {
    async init() {
      const surveyPath = location.pathname.split('/').pop();
      if (!surveyPath) {
        this.$store.commit('setRouter', 'emptyPage');
      } else {
        try {
          const res = await getPublishedSurveyInfo({ surveyPath });
          if (res.code === 200) {
            const data = res.data;
            const {
              bannerConf,
              baseConf,
              bottomConf,
              dataConf,
              skinConf,
              submitConf,
            } = data.code;
            document.title = data.title;
            const questionData = {
              bannerConf,
              baseConf,
              bottomConf,
              dataConf,
              skinConf,
              submitConf,
            };
            this.setSkin(skinConf)
            this.$store.commit('setSurveyPath', surveyPath);
            this.$store.dispatch('init', questionData);
            this.$store.dispatch('getEncryptInfo');
          } else {
            throw new Error(res.errmsg);
          }
        } catch (error) {
          console.log(error);
          this.$dialog.alert({
            title: error.message || '获取问卷失败',
          });
        }
      }
    },
    setSkin(skinConf) {
      const { themeConf, backgroundConf, contentConf} = skinConf
      const root = document.documentElement;
      if(themeConf?.color) {
        root.style.setProperty('--primary-color', themeConf?.color); // 设置主题颜色
      }
      if(backgroundConf?.color) {
        root.style.setProperty('--primary-background-color', backgroundConf?.color); // 设置背景颜色
      }
      if(contentConf?.opacity.toString()) {
        console.log({opacity: (contentConf?.opacity)/100})
        root.style.setProperty('--opacity', (contentConf?.opacity)/100); // 设置全局透明度
      }
    }
  },
};
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
