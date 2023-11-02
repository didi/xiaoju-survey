<template>
  <div id="app">
    <Component v-if="$store.state.router" :is="$store.state.router"></Component>
    <logo></logo>
  </div>
</template>

<script>
import { getPublishedSurveyInfo } from './api/survey';

import emptyPage from './pages/emptyPage.vue';
import indexPage from './pages/index.vue';
import errorPage from './pages/errorPage.vue';
import successPage from './pages/successPage.vue';

import logo from './components/logo.vue';

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
  computed: {},
  created() {
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
            this.$store.commit('setSurveyPath', surveyPath);
            this.$store.dispatch('init', questionData);
          } else {
            throw new Error(res.errmsg);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
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

body,
.container {
  height: 100%;
}

#app {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 750px;
  margin: auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
}
</style>
