import { computed } from 'vue';
import store from '@/management/store'
import { cleanRichText } from '@/common/xss'
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
      if(value instanceof Array) {
        return options.filter((item: any) => value.includes(item.hash)).map((item: any) => cleanRichText(item.text))
      } else  {
        return options.filter((item: any) => item.hash === value).map((item: any) => cleanRichText(item.text))
      }
    }
  })
  return { getQuestionTitle, getOptionTitle }
}
