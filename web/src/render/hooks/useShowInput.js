import { useStore } from '@/render/stores'
export const useShowInput = (questionKey) => {
  const store = useStore()
  const { changeData } = store
  const formValues = store.state.formValues
  const questionVal = formValues[questionKey]
  let rangeConfig = store.state.questionData[questionKey].rangeConfig
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
          changeData(data)
        }
      }
    }
  }

  return { rangeConfig, othersValue }
}
