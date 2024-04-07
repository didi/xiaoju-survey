import { forEach, set } from 'lodash';
export default {
  // 将数据设置到state上
  assignState(state, data) {
    forEach(data, (value, key) => {
      state[key] = value
    });
  },
  setQuestionData(state, data) {
    state.questionData = data;
  },
  setRouter(state, data) {
    state.router = data;
  },
  setErrorInfo(state, { errorType, errorMsg }) {
    state.errorInfo = {
      errorType,
      errorMsg,
    };
  },
  changeFormData(state, data) {
    let { key, value } = data;
    set(state, `formValues.${key}`, value);
    // set(state, `questionData.${key}.value`, value)
  },
  changeSelectMoreData(state, data) {
    const { key, value, field } = data;
    set(state, `questionData.${field}.othersValue.${key}`, value);
  },
  setEnterTime(state) {
    state.enterTime = Date.now();
  },
  setSurveyPath(state, data) {
    state.surveyPath = data;
  },
  setVoteMap(state, data) {
    state.voteMap = data
  },
  setQuestionSeq(state, data) {
    state.questionSeq = data;
  },
  setEncryptInfo(state, data) {
    state.encryptInfo = data;
  },
};
