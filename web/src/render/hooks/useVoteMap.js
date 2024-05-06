import { computed } from 'vue'
import store from '../store/index'
export const useVoteMap = (questionKey) => {
  let voteTotal = computed(() => store.state.voteMap?.[questionKey]?.total || 0)

  const options = computed(() => {
     return store.state.questionData[questionKey].options.map(option => {
      const optionHash = option.hash
      const voteCount = store.state.voteMap?.[questionKey]?.[optionHash] || 0
      
      return {
        ...option,
        voteCount
      }
    })
  })
  
  return { options, voteTotal }
}