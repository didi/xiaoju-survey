import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import { useSurveyStore } from '@/render/stores/survey'
import { queryOptionCountInfo } from '@/render/api/survey'
import { NORMAL_CHOICES, QUESTION_TYPE } from '@/common/typeEnum'

// 投票进度逻辑聚合
const useOptionCountMap = (questionData) => {
  const voteMap = ref({})
  const quotaMap = ref({})
  //初始化投票题的数据
  const initOptionCountInfo = async () => {
    const surveyStore = useSurveyStore()
    const surveyPath = surveyStore.surveyPath

    const fieldList = []

    for (const field in questionData.value) {
      const { type } = questionData.value[field]
      if (type.includes(QUESTION_TYPE.VOTE)) {
        fieldList.push(field)
      }
      if (NORMAL_CHOICES.includes(type)) {
        fieldList.push(field)
      }
    }

    if (fieldList.length <= 0) {
      return
    }
    try {
      const countRes = await queryOptionCountInfo({
        surveyPath,
        fieldList: fieldList.join(',')
      })

      if (countRes.code === 200) {
        setVoteMap(countRes.data)
      }
      Object.keys(countRes.data).forEach(field => {
        Object.keys(countRes.data[field]).forEach((optionHash) => {
          updateQuotaMapByKey({ questionKey: field, optionKey: optionHash, data: countRes.data[field][optionHash] })
        })
      })
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
    const currentQuestion = questionData.value[questionKey]
    const options = currentQuestion.options
    const voteTotal = voteMap[questionKey]?.total || 0
    let totalPayload = {
      questionKey,
      voteKey: 'total',
      voteValue: voteTotal
    }
    options.forEach((option) => {
      const optionHash = option.hash
      const voteCount = voteMap?.[questionKey]?.[optionHash] || 0
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
  const updateQuotaMapByKey = ({ questionKey, optionKey, data }) =>{
    // 兼容为空的情况
    if (!quotaMap.value[questionKey]) {
      quotaMap.value[questionKey] = {}
    }
    quotaMap.value[questionKey][optionKey] = data
  }
  return {
    voteMap,
    quotaMap,
    setVoteMap,
    initOptionCountInfo,
    updateVoteData,
    updateQuotaMapByKey,
  }
}

export const useQuestionStore = defineStore('question', () => {
  const questionData = ref(null)
  const questionSeq = ref([]) // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]
  const pageIndex = ref(1) // 当前分页的索引
  const changeField = ref(null)
  const changeIndex = computed(() => {
    if(!changeField.value || !questionData.value) return null
    return questionData.value[changeField.value]?.index
  })
  const needHideFields = ref([])

  // 题目列表
  const questionList = computed(() => {
    let index = 1
    const hideMap = needHideFields.value.concat(showLogicHideFields.value)
    return (
      questionSeq.value &&
      questionSeq.value.reduce((pre, item) => {
        const questionArr = []

        item.forEach((questionKey) => {
          const question = { ...questionData.value[questionKey] }
          // 开启显示序号
          if (question.showIndex && !hideMap.includes(questionKey)) {
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
  const { voteMap, quotaMap, setVoteMap, initOptionCountInfo, updateVoteData } = useOptionCountMap(questionData)

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
  const showLogicHideFields = ref([])
  const addShowLogicHideFields = (fields) => {
    fields.forEach((field) => {
      if (!showLogicHideFields.value.includes(field)) {
        showLogicHideFields.value.push(field)
      }
    })
  }
  const removeShowLogicHideFields = (fields) => {
    showLogicHideFields.value = showLogicHideFields.value.filter((field) => !fields.includes(field))
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
    quotaMap,
    setVoteMap,
    initOptionCountInfo,
    updateVoteData,
    changeField,
    changeIndex,
    setChangeField,
    needHideFields,
    addNeedHideFields,
    removeNeedHideFields,
    showLogicHideFields,
    addShowLogicHideFields,
    removeShowLogicHideFields,
    getQuestionIndexByField
  }
})
