import { get as _get, set as _set, merge as _merge } from 'lodash-es';

export default {
  setCurrentEditOne(state, data) {
    state.currentEditOne = data;
  },
  changeStatusPreview(state, { type }) {
    state.currentEditStatus = type;
  },
  updateSchemaUpdateTime(state) {
    state.schemaUpdateTime = Date.now();
  },
  initSchema(state, { metaData, codeData }) {
    state.schema.metaData = metaData;
    state.schema.bannerConf = _merge(
      {},
      state.schema.bannerConf,
      codeData.bannerConf
    );
    state.schema.bottomConf = _merge(
      {},
      state.schema.bottomConf,
      codeData.bottomConf
    );
    state.schema.skinConf = _merge(
      {},
      state.schema.skinConf,
      codeData.skinConf
    );
    state.schema.baseConf = _merge(
      {},
      state.schema.baseConf,
      codeData.baseConf
    );
    state.schema.submitConf = _merge(
      {},
      state.schema.submitConf,
      codeData.submitConf
    );
    state.schema.questionDataList = codeData.questionDataList || [];
  },
  setSurveyId(state, data) {
    state.surveyId = data;
  },
  addQuestion(state, { question, index }) {
    state.schema.questionDataList.splice(index, 0, question);
  },
  deleteQuestion(state, { index }) {
    state.schema.questionDataList.splice(index, 1);
  },
  moveQuestion(state, { index, range }) {
    let start, end;
    if (range < 0) {
      // 向上移动
      start = index + range;
      end = index;
    } else if (range > 0) {
      // 向下移动
      start = index + 1;
      end = index + range + 1;
    } else {
      // 无变化
      return;
    }
    const currentData = state.schema.questionDataList[index];
    // 新位置和老位置之间所有的题目
    const comparedList = state.schema.questionDataList.slice(start, end);
    if (range < 0) {
      // 向上移动
      state.schema.questionDataList.splice(
        index + range,
        1 - range,
        currentData,
        ...comparedList
      );
    } else if (range > 0) {
      // 向下移动
      state.schema.questionDataList.splice(
        index,
        range + 1,
        ...comparedList,
        currentData
      );
    }
  },
  changeSchema(state, { key, value }) {
    _set(state.schema, key, value);
  },
  changeThemePreset(state, presets) {
    Object.keys(presets).forEach(key => {
      _set(state.schema, key, presets[key]);
    })
  }
};
