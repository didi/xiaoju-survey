import { RuleBuild } from "@/common/logicEngine/domain/RuleBuild";

export default {
  namespaced: true,
  state: {
    showLogicEngine: null
  },
  mutations: {
    setShowLogicEngine(state, logicEngine) {
      state.showLogicEngine = logicEngine
    },
  },
  actions: {
    initShowLogic({ commit }, ruleConf) {
      const showLogicEngine = new RuleBuild().fromJson(ruleConf);
      commit('setShowLogicEngine', showLogicEngine)
    },
  } 
}