import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { cleanRichText } from '@/common/xss'
export const useQuestionInfo = (field) => {
  const editStore = useEditStore()
  const { questionDataList } = storeToRefs(editStore)

  const getQuestionTitle = computed(() => {
    return () => {
      if (field === 'end') return '问卷末尾'
      return cleanRichText(questionDataList.value.find((item) => item.field === field)?.title)
    }
  })
  const getOptionTitle = computed(() => {
    return (value) => {
      const options = questionDataList.value.find((item) => item.field === field)?.options || []
      if (value instanceof Array) {
        return options
          .filter((item) => value.includes(item.hash))
          .map((item) => cleanRichText(item.text))
      } else {
        return options.filter((item) => item.hash === value).map((item) => cleanRichText(item.text))
      }
    }
  })
  return { getQuestionTitle, getOptionTitle }
}
