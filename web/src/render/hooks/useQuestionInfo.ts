import { useQuestionStore } from '@/render/stores/question'
import { cleanRichText } from '@/common/xss'
export const useQuestionInfo = (field: string) => {
  const questionstore = useQuestionStore()

  const questionTitle = cleanRichText(questionstore.questionData[field]?.title)
  const getOptionTitle = (value: any) => {
    const options = questionstore.questionData[field]?.options || []
    if (value instanceof Array) {
      return options
        .filter((item: any) => value.includes(item.hash))
        .map((item: any) => cleanRichText(item.text))
    } else {
      return options
        .filter((item: any) => item.hash === value)
        .map((item: any) => cleanRichText(item.text))
    }
  }
  return { questionTitle, getOptionTitle }
}
