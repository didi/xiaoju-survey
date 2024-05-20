import { computed } from 'vue';
import store from '@/management/store'
import { cleanRichText } from '@/common/xss'
export const useQuestionInfo = (field) => {
  const getQuestionTitle = computed(() => {
    const questionDataList = store.state.edit.schema.questionDataList
    return () => {
      return questionDataList.find((item) => item.field === field)?.title
    }
  })
  const getOptionTitle = computed(() => {
    const questionDataList = store.state.edit.schema.questionDataList
    return (value) => {
      const options = questionDataList.find((item) => item.field === field)?.options || []
      if(value instanceof Array) {
        return options.filter((item) => value.includes(item.hash)).map((item) => cleanRichText(item.text))
      } else  {
        return options.filter((item) => item.hash === value).map((item) => cleanRichText(item.text))
      }
    }
  })
  return { getQuestionTitle, getOptionTitle }
}
