import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { set } from 'lodash-es'
import { useSurveyStore } from '@/render/stores/survey'
import { queryVote } from '@/render/api/survey'

const VOTE_INFO_KEY = 'voteinfo'

export const useQuestionStore = defineStore('question', () => {
  const voteMap = ref({})
  const questionData = ref(null)
  const questionSeq = ref([]) // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]
  const pageIndex = ref(1) // 当前分页的索引
  const surveyStore = useSurveyStore()
  const changeField = ref(null)
  const changeIndex = computed(() => {
    return surveyStore.dataConf.dataList.findIndex((item) => item.field === changeField.value)
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

  const changeSelectMoreData = (data) => {
    const { key, value, field } = data
    set(questionData.value, `${field}.othersValue.${key}`, value)
  }

  const setQuestionSeq = (data) => {
    questionSeq.value = data
  }

  const setVoteMap = (data) => {
    voteMap.value = data
  }

  const updateVoteMapByKey = (data) => {
    const { questionKey, voteKey, voteValue } = data
    // 兼容为空的情况
    if (!voteMap.value[questionKey]) {
      voteMap.value[questionKey] = {}
    }
    voteMap.value[questionKey][voteKey] = voteValue
  }

  //初始化投票题的数据
  const initVoteData = async () => {
    const surveyStore = useSurveyStore()
    const surveyPath = surveyStore.surveyPath

    const fieldList = []

    for (const field in questionData.value) {
      const { type } = questionData.value[field]
      if (/vote/.test(type)) {
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

  const updateVoteData = (data) => {
    const { key: questionKey, value: questionVal } = data
    // 更新前获取接口缓存在localStorage中的数据
    const localData = localStorage.getItem(VOTE_INFO_KEY)
    const voteinfo = JSON.parse(localData)
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

  const setChangeField = (field) => {
    changeField.value = field
  }
  const getQuestionIndexByField = (field) => {
    return questionData.value[field].index
  }
  const addNeedHideFields = (fields) => {
    // skipItems.forEach(item => {
    //   // 已经被隐藏的题目不需要再push
    //   if(!needHideFields.value.map(i=> i.targetField).includes(item.targetField)) {
    //     needHideFields.value.push(item)
    //   }
    // })
    fields.forEach(field => {
      if(!needHideFields.value.includes(field)) {
        needHideFields.value.push(field)
      }
    })
  }
  const removeNeedHideFields = (fields) => {
    needHideFields.value = needHideFields.value.filter(field => !fields.includes(field))
  }
  const processJumpSkip = () => {
    const targetResult = surveyStore.jumpLogicEngine
      .getResultsByField(changeField.value, surveyStore.formValues)
      .map(item => {
        // 获取目标题的序号，处理跳转问卷末尾为最大题的序号
        const index = item.target === 'end' ? surveyStore.dataConf.dataList.length : getQuestionIndexByField(item.target)
        return {
          index,
          ...item
        }
      })
    const notMatchedFields = targetResult.filter(item => !item.result)
    const matchedFields = targetResult.filter(item => item.result)
    // 目标题均未匹配，需要展示出来条件题和目标题之间的题目
    if (notMatchedFields.length) {
      console.log({notMatchedFields})
      console.log({needHideFields: needHideFields.value})
      notMatchedFields.forEach(element => {
        const endIndex = element.index
        const fields = surveyStore.dataConf.dataList.slice(changeIndex.value + 1, endIndex).map(item => item.field)
        // hideMap中remove被跳过的题
        removeNeedHideFields(fields)
      });
    }
  
    if (!matchedFields.length) return
    // 匹配到多个目标题时，取最大序号的题目
    const maxIndexQuestion =
      matchedFields.filter(item => item.result).sort((a, b) => b.index - a.index)[0].index
  
    // 条件题和目标题之间的题目隐藏
    const skipKey = surveyStore.dataConf.dataList
      .slice(changeIndex.value + 1, maxIndexQuestion).map(item => item.field)
    addNeedHideFields(skipKey)
  }
  return {
    voteMap,
    questionData,
    questionSeq,
    renderData,
    isFinallyPage,
    pageIndex,
    addPageIndex,
    setQuestionData,
    changeSelectMoreData,
    setQuestionSeq,
    setVoteMap,
    updateVoteMapByKey,
    initVoteData,
    updateVoteData,
    changeField,
    changeIndex,
    setChangeField,
    needHideFields,
    addNeedHideFields,
    removeNeedHideFields,
    processJumpSkip,
    getQuestionIndexByField
  }
})
