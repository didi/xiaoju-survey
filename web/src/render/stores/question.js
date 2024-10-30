import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import { useSurveyStore } from '@/render/stores/survey'
import { queryVote } from '@/render/api/survey'
import { QUESTION_TYPE } from '@/common/typeEnum'

import { getVoteData, setVoteData, clearVoteData } from '@/render/utils/storage'

// 投票进度逻辑聚合
const useVoteMap = (questionData) => {
  const voteMap = ref({})
  //初始化投票题的数据
  const initVoteData = async () => {
    const surveyStore = useSurveyStore()
    const surveyPath = surveyStore.surveyPath

    const fieldList = []

    for (const field in questionData.value) {
      const { type } = questionData.value[field]
      if (type.includes(QUESTION_TYPE.VOTE)) {
        fieldList.push(field)
      }
    }

    if (fieldList.length <= 0) {
      return
    }
    try {
      clearVoteData()
      const voteRes = await queryVote({
        surveyPath,
        fieldList: fieldList.join(',')
      })

      if (voteRes.code === 200) {
        setVoteData(voteRes.data)
        setVoteMap(voteRes.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const updateVoteMapByKey = (data) => {
    const { questionKey, voteKey, voteValue } = data
    // 兼容为空的情况
    if (!voteMap.value[questionKey]) {
      voteMap.value[questionKey] = {}
    }
    voteMap.value[questionKey][voteKey] = voteValue
  }
  const setVoteMap = (data) => {
    voteMap.value = data
  }
  const updateVoteData = (data) => {
    const { key: questionKey, value: questionVal } = data
    // 更新前获取接口缓存在localstorage中的数据
    const voteInfo = getVoteData()
    const currentQuestion = questionData.value[questionKey]
    const options = currentQuestion.options
    const voteTotal = voteInfo?.[questionKey]?.total || 0
    let totalPayload = {
      questionKey,
      voteKey: 'total',
      voteValue: voteTotal
    }
    options.forEach((option) => {
      const optionHash = option.hash
      const voteCount = voteInfo?.[questionKey]?.[optionHash] || 0
      // 如果选中值包含该选项，对应voteCount 和 voteTotal  + 1
      if (
        Array.isArray(questionVal) ? questionVal.includes(optionHash) : questionVal === optionHash
      ) {
        const countPayload = {
          questionKey,
          voteKey: optionHash,
          voteValue: voteCount + 1
        }
        totalPayload.voteValue += 1
        updateVoteMapByKey(countPayload)
      } else {
        const countPayload = {
          questionKey,
          voteKey: optionHash,
          voteValue: voteCount
        }
        updateVoteMapByKey(countPayload)
      }
      updateVoteMapByKey(totalPayload)
    })
  }
  return {
    voteMap,
    initVoteData,
    updateVoteData
  }
}

export const useQuestionStore = defineStore('question', () => {
  const questionData = ref(null)
  const questionSeq = ref([]) // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]
  const pageIndex = ref(1) // 当前分页的索引
  const changeField = ref(null)
  const changeIndex = computed(() => {
    return questionData.value[changeField.value]?.index
  })
  const needHideFields = ref([])

  // 题目列表
  const questionList = computed(() => {
    let index = 1
    return (
      questionSeq.value &&
      questionSeq.value.reduce((pre, item) => {
        const questionArr = []

        item.forEach((questionKey) => {
          const question = { ...questionData.value[questionKey] }
          // 开启显示序号
          if (question.showIndex) {
            question.indexNumber = index++
          }

          questionArr.push(question)
        })

        if (questionArr && questionArr.length) {
          pre.push(questionArr)
        }

        return pre
      }, [])
    )
  })

  const renderData = computed(() => {
    const { startIndex, endIndex } = getSorter()
    const data = questionList.value[0]
    if (!data || !Array.isArray(data) || data.length === 0) return []
    return [data.slice(startIndex, endIndex)]
  })

  const isFinallyPage = computed(() => {
    const surveyStore = useSurveyStore()
    if (surveyStore.pageConf.length === 0) {
      return true
    }
    return pageIndex.value === surveyStore.pageConf.length
  })

  const addPageIndex = () => {
    pageIndex.value++
  }

  const getSorter = () => {
    let startIndex = 0
    const surveyStore = useSurveyStore()
    const newPageEditOne = pageIndex.value
    const endIndex = surveyStore.pageConf[newPageEditOne - 1]

    for (let index = 0; index < surveyStore.pageConf.length; index++) {
      const item = surveyStore.pageConf[index]
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

  const setQuestionData = (data) => {
    questionData.value = data
  }
  const { voteMap, setVoteMap, initVoteData, updateVoteData } = useVoteMap(questionData)

  const changeSelectMoreData = (data) => {
    const { key, value, field } = data
    set(questionData.value, `${field}.othersValue.${key}`, value)
  }

  const setQuestionSeq = (data) => {
    questionSeq.value = data
  }

  const setChangeField = (field) => {
    changeField.value = field
  }
  const getQuestionIndexByField = (field) => {
    return questionData.value[field].index
  }
  const addNeedHideFields = (fields) => {
    fields.forEach((field) => {
      if (!needHideFields.value.includes(field)) {
        needHideFields.value.push(field)
      }
    })
  }
  const removeNeedHideFields = (fields) => {
    needHideFields.value = needHideFields.value.filter((field) => !fields.includes(field))
  }
  return {
    questionData,
    questionSeq,
    renderData,
    isFinallyPage,
    pageIndex,
    addPageIndex,
    setQuestionData,
    changeSelectMoreData,
    setQuestionSeq,
    voteMap,
    setVoteMap,
    initVoteData,
    updateVoteData,
    changeField,
    changeIndex,
    setChangeField,
    needHideFields,
    addNeedHideFields,
    removeNeedHideFields,
    getQuestionIndexByField
  }
})
