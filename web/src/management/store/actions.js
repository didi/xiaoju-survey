import { getBannerData } from '@/management/api/skin.js'
import { RuleBuild } from '@/common/logicEngine/RuleBuild'

export default {
  async getBannerData({ state, commit }) {
    if (state.bannerList && state.bannerList.length > 0) {
      return
    }
    const res = await getBannerData()
    if (res.code === 200) {
      commit('setBannerList', res.data)
    }
  },
  initShowLogic({ commit }, ruleConf) {
    const showLogicEngine = new RuleBuild(ruleConf)
    commit('setShowLogicEngine', showLogicEngine)
  }
}
