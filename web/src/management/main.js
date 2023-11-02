import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import './styles/element-variables.scss';
import { filterXSS, cleanRichText } from '@/common/xss';

Vue.config.productionTip = false;
Vue.use(ElementUI);

const safeHtml = function (el, binding) {
  const res = filterXSS(binding.value);
  el.innerHTML = res;
};

const plainText = function (el, binding) {
  const text = cleanRichText(binding.value);
  el.innerText = text;
};

Vue.directive('safe-html', {
  inserted: safeHtml,
  componentUpdated: safeHtml,
});

Vue.directive('plain-text', {
  inserted: plainText,
  componentUpdated: plainText,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
