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
    return (value: string | Array<string>) => {
      const options = questionDataList.find((item: any) => item.field === field)?.options || []
      return options?.map((item: any) => {
        if(value instanceof Array) {
          return value.map((v: string) => {
            if (item.hash === v) {
              return item.text
            }
          })
        } else if (item.hash === value) {
          return item.text
        }
      })
    }
  })
  return { getQuestionTitle, getOptionTitle }
}
