import { type Ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'

import { filterQuestionPreviewData, getNewField } from '@/management/utils/index'
import { useShowLogicInfo } from '@/management/hooks/useShowLogicInfo'
import { useJumpLogicInfo } from '@/management/hooks/useJumpLogicInfo'

export default function usePageEdit(
  {
    schema,
    questionDataList
  }: {
    schema: any
    questionDataList: Ref<any[]>
  },
  updateTime: () => void
) {
  const pageConf = computed(() => schema.pageConf)
  const pageEditOne = computed(() => {
    return schema.pageEditOne
  })
  const isFinallyPage = computed(() => {
    return pageEditOne.value === pageConf.value.length
  })
  const pageCount = computed(() => pageConf.value.length || 0)

  const pageQuestionData = computed(() => {
    return getPageQuestionData(pageEditOne.value)
  })

  const getPageQuestionData = (index: number) => {
    const { startIndex, endIndex } = getSorter(index)
    return filterQuestionPreviewData(questionDataList.value).slice(startIndex, endIndex)
  }

  const getSorter = (index?: number) => {
    let startIndex = 0
    const newPageEditOne = index || pageEditOne.value
    const endIndex = pageConf.value[newPageEditOne - 1]

    for (let index = 0; index < pageConf.value.length; index++) {
      const item = pageConf.value[index]
      if (newPageEditOne - 1 == index) {
        break
      }
      startIndex += item
    }
    return {
      startIndex,
      endIndex: startIndex + endIndex
    }
  }

  const addPage = () => {
    schema.pageConf.push(1)
  }

  const updatePageEditOne = (index: number) => {
    schema.pageEditOne = index
  }

  const deletePage = (index: number) => {
    if (pageConf.value.length <= 1) return
    const { startIndex, endIndex } = getSorter(index)
    const newQuestionList = cloneDeep(questionDataList.value)
    const deleteFields = newQuestionList
      .slice(startIndex, endIndex - startIndex)
      .map((i) => i.field)

    // 删除分页判断题目是否存在逻辑关联
    const hasLogic = deleteFields.filter((field) => {
      const { hasShowLogic } = useShowLogicInfo(field)
      const { hasJumpLogic } = useJumpLogicInfo(field)
      return hasShowLogic || hasJumpLogic
    })
    if (hasLogic.length) {
      ElMessageBox.alert('该分页下有题目被显示或跳转逻辑关联，请先清除', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    updatePageEditOne(1)
    newQuestionList.splice(startIndex, endIndex - startIndex)
    schema.pageConf.splice(index - 1, 1)
    questionDataList.value = newQuestionList
    updateTime()
  }

  const swapArrayRanges = (index: number, range: number) => {
    const { startIndex: start1, endIndex: end1 } = getSorter(index)
    const { startIndex: start2, endIndex: end2 } = getSorter(range)
    const newQuestion = cloneDeep(questionDataList.value)
    const range1 = newQuestion.slice(start1, end1)
    const range2 = newQuestion.slice(start2, end2)
    newQuestion.splice(start1, range1.length, ...range2)
    newQuestion.splice(start2, range2.length, ...range1)
    questionDataList.value = newQuestion
    const rangeCount = schema.pageConf[range - 1]
    schema.pageConf[range - 1] = schema.pageConf[index - 1]
    schema.pageConf[index - 1] = rangeCount
    updateTime()
  }

  const copyPage = (index: number) => {
    const newQuestionList = cloneDeep(getPageQuestionData(index))
    newQuestionList.forEach((item) => {
      item.field = getNewField(questionDataList.value.map((item) => item.field))
    })
    schema.pageConf.splice(index, 0, newQuestionList.length)
    const { endIndex } = getSorter(index)
    questionDataList.value.splice(endIndex, 0, ...newQuestionList)
    updateTime()
  }

  const pageOperations = (type: string) => {
    const count = pageConf.value[pageEditOne.value - 1]
    if (type == 'add') {
      if (count != undefined) {
        schema.pageConf[pageEditOne.value - 1] = count + 1
      }
      return
    }
    if (type == 'remove') {
      if (count) {
        schema.pageConf[pageEditOne.value - 1] = count - 1
      }
    }
  }

  const setPage = (data: Array<number>) => {
    for (let index = 0; index < pageConf.value.length; index++) {
      const newIndex = data[index]
      const oldIndex = pageConf.value[index]
      if (newIndex != oldIndex) {
        schema.pageConf[index] = newIndex
      }
    }
  }

  return {
    pageEditOne,
    pageConf,
    isFinallyPage,
    pageCount,
    pageQuestionData,
    getSorter,
    updatePageEditOne,
    deletePage,
    addPage,
    copyPage,
    getPageQuestionData,
    pageOperations,
    swapArrayRanges,
    setPage
  }
}
