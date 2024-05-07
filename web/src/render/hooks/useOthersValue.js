import store from '../store/index'
export const useOthersValue = (questionKey) => {
  const formValues = store.state.formValues
  let othersValue = {}
  let options = store.state.questionData[questionKey].options.map(optionItem => {
    if (optionItem.others) {
      const opKey = `${questionKey}_${optionItem.hash}`
      othersValue[opKey] = formValues[opKey]
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