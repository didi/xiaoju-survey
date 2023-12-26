import { getBannerData } from '@/management/api/skin.js';

export default {
  async getBannerData({ state, commit }) {
    if (state.bannerList && state.bannerList.length > 0) {
      return;
    }
    const res = await getBannerData();
    if (res.code === 200) {
      commit('setBannerList', res.data);
    }
  },
};
