import { computed } from 'vue'
import store from '../store/index'
export const useOthersValue = (questionKey) => {
  
  let options = computed(() => {
    const formValues = store.state.formValues
    return store.state.questionData[questionKey].options.map(optionItem => {
      if (optionItem.others) {
        const opKey = `${questionKey}_${optionItem.hash}`
        return {
          ...optionItem,
          othersKey: opKey,
          othersValue: formValues[opKey]
        }
      } else {
        return optionItem
      }
    })
  })
  let othersValue = computed(() => {
    const othersValue = {}
    const formValues = store.state.formValues
    store.state.questionData[questionKey].options.forEach((optionItem) => {
      if (optionItem.others) {
        const opKey = `${questionKey}_${optionItem.hash}`
        othersValue[opKey] = formValues[opKey]
      }
    })
    return othersValue
  })
  
  return { options, othersValue }
}