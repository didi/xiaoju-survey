import { useQuestionStore } from '../stores/question'
export const useOptionsQuota = (questionKey) => {
  const questionStore = useQuestionStore()
  const options = questionStore.questionData[questionKey].options.map((option) => {
    if(option.quota){
      const optionHash = option.hash
      const selectCount = questionStore.quotaMap?.[questionKey]?.[optionHash] || 0
      const release = Number(option.quota) - Number(selectCount)
      return {
        ...option,
        disabled: release === 0,
        selectCount,
        release
      }
    } else {
      return {
        ...option,
      }
    }
  })

  return { options }
}