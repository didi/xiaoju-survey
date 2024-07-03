import { useStore } from '@/render/stores'
import { storeToRefs } from 'pinia'

export const useVoteMap = (questionKey) => {
  const store = useStore()
  const { voteMap, questionData } = storeToRefs(store)
  let voteTotal = voteMap.value?.[questionKey]?.total || 0

  const options = questionData.value[questionKey].options.map((option) => {
    const optionHash = option.hash
    const voteCount = voteMap.value?.[questionKey]?.[optionHash] || 0

    return {
      ...option,
      voteCount
    }
  })

  return { options, voteTotal }
}
