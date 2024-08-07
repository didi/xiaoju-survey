import store from '../store/index'
export const useOptionsQuota = (questionKey) => {
  const options = store.state.questionData[questionKey].options.map((option) => {
    if(option.quota){
      const optionHash = option.hash
      const selectCount = store.state.quotaMap?.[questionKey]?.[optionHash] || 0
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