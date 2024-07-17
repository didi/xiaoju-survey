import { forEach, set } from 'lodash-es'
export default {
  // 将数据设置到state上
  assignState(state, data) {
    forEach(data, (value, key) => {
      state[key] = value
    })
  },
  setQuestionData(state, data) {
    state.questionData = data
  },
  setErrorInfo(state, { errorType, errorMsg }) {
    state.errorInfo = {
      errorType,
      errorMsg
    }
  },
  changeFormData(state, data) {
    let { key, value } = data
    set(state, `formValues.${key}`, value)

    //数据加密
    var formData = Object.assign({}, state.formValues);
    for(const key in formData){
      formData[key] = encodeURIComponent(formData[key])
    }

    //浏览器存储
    localStorage.removeItem(state.surveyPath + "_questionData")
    localStorage.setItem(state.surveyPath + "_questionData", JSON.stringify(formData))
    localStorage.setItem('isSubmit', JSON.stringify(false))

  },
  changeSelectMoreData(state, data) {
    const { key, value, field } = data
    set(state, `questionData.${field}.othersValue.${key}`, value)
  },
  setEnterTime(state) {
    state.enterTime = Date.now()
  },
  setSurveyPath(state, data) {
    state.surveyPath = data
  },
  setVoteMap(state, data) {
    state.voteMap = data
  },
  updateVoteMapByKey(state, data) {
    const { questionKey, voteKey, voteValue } = data
    // 兼容为空的情况
    if (!state.voteMap[questionKey]) {
      state.voteMap[questionKey] = {}
    }
    state.voteMap[questionKey][voteKey] = voteValue
  },
  setQuestionSeq(state, data) {
    state.questionSeq = data
  },
  setEncryptInfo(state, data) {
    state.encryptInfo = data
  },
  updateQuotaMapByKey(state, { questionKey, optionKey, data }) {
    // 兼容为空的情况
    if (!state.quotaMap[questionKey]) {
      state.quotaMap[questionKey] = {}
    }
    state.quotaMap[questionKey][optionKey] = data
  }
}
