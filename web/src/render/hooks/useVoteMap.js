import { useQuestionStore } from '../stores/question'

export const useVoteMap = (questionKey) => {
  const questionStore = useQuestionStore()
  let voteTotal = questionStore.voteMap?.[questionKey]?.total || 0

  const options = questionStore.questionData[questionKey].options.map((option) => {
    const optionHash = option.hash
    const voteCount = questionStore.voteMap?.[questionKey]?.[optionHash] || 0

    return {
      ...option,
      voteCount
    }
  })

  return { options, voteTotal }
}
