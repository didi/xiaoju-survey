import { useQuestionStore } from '../stores/question'
import { useSurveyStore } from '../stores/survey'

export const useOthersData = (questionKey) => {
  const questionStore = useQuestionStore()
  const surveyStore = useSurveyStore()
  const formValues = surveyStore.formValues
  const questionVal = formValues[questionKey]
  let othersValue = {}
  let options = questionStore.questionData[questionKey].options.map((optionItem) => {
    if (optionItem.others) {
      const opKey = `${questionKey}_${optionItem.hash}`
      othersValue[opKey] = formValues[opKey]
      if (!questionVal.includes(optionItem.hash) && formValues[opKey]) {
        // 如果选项被未被选中且对应的填写更多有值，则清空填写更多
        const data = {
          key: opKey,
          value: ''
        }
        surveyStore.changeData(data)
      }
      return {
        ...optionItem,
        othersKey: opKey,
        othersValue: formValues[opKey]
      }
    } else {
      return optionItem
    }
  })

  return { options, othersValue }
}
