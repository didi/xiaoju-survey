import Vue from 'vue';
import Vuex from 'vuex';
import edit from './edit';
import user from './user';

import actions from './actions';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters: {},
  mutations,
  actions,
  modules: {
    edit,
    user,
  },
});
