import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { filterXSS } from '@/common/xss';
import DialogPlugin from '@/render/plugins/dialog/index';
import './styles/reset.scss';

Vue.config.productionTip = false;

Vue.use(DialogPlugin);

Vue.directive('safe-html', {
  inserted: function (el, binding) {
    const res = filterXSS(binding.value);
    el.innerHTML = res;
  },
});

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app');
