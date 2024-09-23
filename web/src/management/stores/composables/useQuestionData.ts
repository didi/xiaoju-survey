import { type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'

import { getNewField } from '@/management/utils'
import { type TypeMethod } from '../composables/useBaseConfig'

export default function useQuestionData({
  questionDataList,
  updateTime,
  pageOperations,
  updateCounts
}: {
  questionDataList: Ref<any[]>
  updateTime: () => void
  pageOperations: (type: string) => void
  updateCounts: (type: TypeMethod, data: any) => void
}) {
  function copyQuestion({ index }: { index: number }) {
    const newQuestion = cloneDeep(questionDataList.value[index])
    newQuestion.field = getNewField(questionDataList.value.map((item) => item.field))
    addQuestion({ question: newQuestion, index })
  }

  function addQuestion({ question, index }: { question: any; index: number }) {
    questionDataList.value.splice(index, 0, question)
    pageOperations('add')
    updateTime()
    updateCounts('ADD', { question })
  }

  function deleteQuestion({ index }: { index: number }) {
    pageOperations('remove')
    const [question] = questionDataList.value.splice(index, 1)
    updateTime()
    updateCounts('REMOVE', { question })
  }

  function moveQuestion({ index, range }: { index: number; range: number }) {
    console.log('move')
    let start, end
    if (range < 0) {
      // 向上移动
      start = index + range
      end = index
    } else if (range > 0) {
      // 向下移动
      start = index + 1
      end = index + range + 1
    } else {
      // 无变化
      return
    }
    const currentData = questionDataList.value[index]
    // 新位置和老位置之间所有的题目
    const comparedList = questionDataList.value.slice(start, end)
    if (range < 0) {
      // 向上移动
      questionDataList.value.splice(index + range, 1 - range, currentData, ...comparedList)
    } else if (range > 0) {
      // 向下移动
      questionDataList.value.splice(index, range + 1, ...comparedList, currentData)
    }
    updateTime()
  }

  return {
    copyQuestion,
    addQuestion,
    deleteQuestion,
    moveQuestion
  }
}
