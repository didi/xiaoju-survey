import store from '../store/index'
import { useQuestionStore } from '../stores/question'

export const useShowInput = (questionKey) => {
  const questionStore = useQuestionStore()
  const formValues = store.state.formValues
  const questionVal = formValues[questionKey]
  let rangeConfig = questionStore.questionData[questionKey].rangeConfig
  let othersValue = {}
  if (rangeConfig && Object.keys(rangeConfig).length > 0) {
    for (let key in rangeConfig) {
      const curRange = rangeConfig[key]
      if (curRange.isShowInput) {
        const rangeKey = `${questionKey}_${key}`
        othersValue[rangeKey] = formValues[rangeKey]
        curRange.othersKey = rangeKey
        curRange.othersValue = formValues[rangeKey]
        if (!questionVal.toString().includes(key) && formValues[rangeKey]) {
          // 如果分值被未被选中且对应的填写更多有值，则清空填写更多
          const data = {
            key: rangeKey,
            value: ''
          }
          store.commit('changeFormData', data)
        }
      }
    }
  }

  return { rangeConfig, othersValue }
}
