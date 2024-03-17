import { getNewField } from '@/management/utils';
import { cloneDeep as _cloneDeep, get as _get } from 'lodash-es';
import { getSurveyById } from '@/management/api/survey';

export default {
  async init({ state, dispatch }) {
    const metaData = _get(state, 'schema.metaData');
    if (!metaData || metaData._id !== state.surveyId) {
      await dispatch('getSchemaFromRemote');
    }
    dispatch('resetState');
  },
  async getSchemaFromRemote({ commit, state }) {
    const res = await getSurveyById(state.surveyId);
    if (res.code === 200) {
      const metaData = res.data.surveyMetaRes;
      document.title = metaData.title;
      const {
        bannerConf,
        bottomConf,
        skinConf,
        baseConf,
        submitConf,
        dataConf,
      } = res.data.surveyConfRes.code;
      commit('initSchema', {
        metaData,
        codeData: {
          bannerConf,
          bottomConf,
          skinConf,
          baseConf,
          submitConf,
          questionDataList: dataConf.dataList,
        },
      });
    } else {
      throw new Error(res.errmsg || '问卷不存在');
    }
  },
  resetState({ commit }) {
    commit('setCurrentEditOne', null);
    commit('changeStatusPreview', { type: 'Success' });
  },
  // 复制题目到当前题目后
  copyQuestion({ commit, state }, { index }) {
    const newQuestion = _cloneDeep(state.schema.questionDataList[index]);
    newQuestion.field = getNewField(
      state.schema.questionDataList.map((item) => item.field)
    );
    commit('addQuestion', { question: newQuestion, index });
  },
  addQuestion({ commit }, { question, index }) {
    commit('addQuestion', { question, index });
    commit('updateSchemaUpdateTime', Date.now());
  },
  deleteQuestion({ commit }, { index }) {
    commit('deleteQuestion', { index });
    commit('updateSchemaUpdateTime', Date.now());
  },
  moveQuestion({ commit }, { index, range }) {
    commit('moveQuestion', { index, range });
    commit('updateSchemaUpdateTime', Date.now());
  },
  changeSchema({ commit }, { key, value }) {
    commit('changeSchema', { key, value });
    commit('updateSchemaUpdateTime', Date.now());
  },
};
