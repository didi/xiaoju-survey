import { computed } from 'vue';
import store from '@/management/store'

export const useQuestionInfo = (field: string) => {
  const getQuestionTitle = computed(() => {
    // @ts-ignore
    const questionDataList = store.state.edit.schema.questionDataList
    return () => {
      return questionDataList.find((item: any) => item.field === field)?.title
    }
  })
  const getOptionTitle = computed(() => {
    // @ts-ignore
    const questionDataList = store.state.edit.schema.questionDataList
    return (value: string) => {
      const options = questionDataList.find((item: any) => item.field === field)?.options || []
      return options?.map((item: any) => {
        if (item.hash === value) {
          return item.text
        }
      })
    }
  })
  return { getQuestionTitle, getOptionTitle }
}
