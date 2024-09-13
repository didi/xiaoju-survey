import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import { useSurveyStore } from '@/render/stores/survey'
import { queryVote } from '@/render/api/survey'
import { QUESTION_TYPE, NORMAL_CHOICES } from '@/common/typeEnum'
import { parseJson } from '@/render/utils/index'
import { VOTE_INFO_KEY, QUOTA_INFO_KEY } from '@/render/utils/constant' 


// 投票进度逻辑聚合
const usevVoteMap = (questionData) => {
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
      localStorage.removeItem(VOTE_INFO_KEY)
      const voteRes = await queryVote({
        surveyPath,
        fieldList: fieldList.join(',')
      })

      if (voteRes.code === 200) {
        localStorage.setItem(
          VOTE_INFO_KEY,
          JSON.stringify({
            ...voteRes.data
          })
        )
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
    // 更新前获取接口缓存在localStorage中的数据
    const localData = localStorage.getItem(VOTE_INFO_KEY)
    const voteinfo = parseJson(localData)
    const currentQuestion = questionData.value[questionKey]
    const options = currentQuestion.options
    const voteTotal = voteinfo?.[questionKey]?.total || 0
    let totalPayload = {
      questionKey,
      voteKey: 'total',
      voteValue: voteTotal
    }
    options.forEach((option) => {
      const optionhash = option.hash
      const voteCount = voteinfo?.[questionKey]?.[optionhash] || 0
      // 如果选中值包含该选项，对应voteCount 和 voteTotal  + 1
      if (
        Array.isArray(questionVal) ? questionVal.includes(optionhash) : questionVal === optionhash
      ) {
        const countPayload = {
          questionKey,
          voteKey: optionhash,
          voteValue: voteCount + 1
        }
        totalPayload.voteValue += 1
        updateVoteMapByKey(countPayload)
      } else {
        const countPayload = {
          questionKey,
          voteKey: optionhash,
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

// 选项配额逻辑聚合
const useQuotaMap = (questionData) => {
  const quotaMap = ref({})
  const updateQuotaMapByKey = ({ questionKey, optionKey, data }) =>{
    // 兼容为空的情况
    if (!quotaMap.value[questionKey]) {
      quotaMap.value[questionKey] = {}
    }
    quotaMap.value[questionKey][optionKey] = data
  }
  const initQuotaMap = async () => {
    const surveyStore = useSurveyStore()
    const surveyPath = surveyStore.surveyPath
    const fieldList = Object.keys(questionData.value).filter(field => {
      if (NORMAL_CHOICES.includes(questionData.value[field].type)) {
        return questionData.value[field].options.some(option => option.quota > 0)
      }
    })

    // 如果不存在则不请求选项上限接口
    if (fieldList.length <= 0) {
      return
    }

    try {
      localStorage.removeItem(QUOTA_INFO_KEY)
      const quotaRes = await queryVote({
        surveyPath,
        fieldList: fieldList.join(',')
      })

      if (quotaRes.code === 200) {
        localStorage.setItem(
          QUOTA_INFO_KEY,
          JSON.stringify({
            ...quotaRes.data
          })
        )
        Object.keys(quotaRes.data).forEach(field => {
          Object.keys(quotaRes.data[field]).forEach((optionHash) => {
            updateQuotaMapByKey({ questionKey: field, optionKey: optionHash, data: quotaRes.data[field][optionHash] })
          })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const updateQuotaData = (data) => {
    const { key: questionKey, value: questionVal } = data
    // 更新前获取接口缓存在localStorage中的数据
    const localData = localStorage.getItem(QUOTA_INFO_KEY)
    const quotaMap = JSON.parse(localData)
    // const quotaMap = state.quotaMap
    const currentQuestion = questionData.value[questionKey]
    const options = currentQuestion.options
    options.forEach((option) => {
      const optionhash = option.hash
      const selectCount = quotaMap?.[questionKey]?.[optionhash].selectCount || 0
      // 如果选中值包含该选项，对应 voteCount 和 voteTotal  + 1
      if (
        Array.isArray(questionVal) ? questionVal.includes(optionhash) : questionVal === optionhash
      ) {
        const countPayload = {
          questionKey,
          optionKey: optionhash,
          selectCount: selectCount + 1
        }
        updateQuotaMapByKey(countPayload)
      } else {
        const countPayload = {
          questionKey,
          optionKey: optionhash,
          selectCount: selectCount
        }
        updateQuotaMapByKey(countPayload)
      }
    })
  }
  return {
    quotaMap,
    initQuotaMap,
    updateQuotaMapByKey,
    updateQuotaData
  }
}

export const useQuestionStore = defineStore('question', () => {
  const questionData = ref(null)
  const questionSeq = ref([]) // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]
  const pageIndex = ref(1) // 当前分页的索引
  const changeField = ref(null)
  const changeIndex = computed(() => {
    return questionData.value[changeField.value].index
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
  const { voteMap, setVoteMap, initVoteData, updateVoteData } = usevVoteMap(questionData)
  const { quotaMap, initQuotaMap,  updateQuotaData } = useQuotaMap(questionData)

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
    getQuestionIndexByField,
    quotaMap,
    initQuotaMap, 
    updateQuotaData
  }
})
