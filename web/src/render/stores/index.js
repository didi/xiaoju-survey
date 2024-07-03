// 问卷相关的Pinia Store
import { defineStore } from "pinia"
import { isMobile as isMobileFn } from '../utils/index'
import { reactive, ref, computed, toRefs } from "vue"
import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')
import adapter from '../adapter'
import { queryVote, getEncryptInfo as fetchEncryptInfo } from '@/render/api/survey'
import { RuleMatch } from '@/common/logicEngine/RulesMatch'
import { set } from 'lodash-es'
/**
 * CODE_MAP不从management引入，在dev阶段，会导致B端 router被加载，进而导致C端路由被添加 baseUrl: /management
 */
const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NO_AUTH: 403
}
const VOTE_INFO_KEY = 'voteinfo'
import router from '../router'

export const useStore = defineStore("survey", () => {
  const surveyPath = ref('')
  const state = reactive({
    questionData: null,
    questionSeq: [],
    rules: {},
    formValues: {},
    bannerConf: null,
    baseConf: null,
    bottomConf: null,
    dataConf: null,
    skinConf: {},
    submitConf: {}
  })
  const { questionData, questionSeq } = toRefs(state)
  const isMobile = isMobileFn()
  const errorInfo = reactive({
    errorType: '',
    errorMsg: ''
  })
  const enterTime = ref()
  // 题目的顺序，因为可能会有分页的情况，所以是一个二维数组[[qid1, qid2], [qid3,qid4]]

  const voteMap = ref({})
  const encryptInfo = ref()
  const ruleEngine = ref()

  const renderData = computed(() => {
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

  // 初始化
  function init(
    { bannerConf, baseConf, bottomConf, dataConf, skinConf, submitConf }
  ) {
    enterTime.value = Date.now()
    const { begTime, endTime, answerBegTime, answerEndTime } = baseConf
    const { msgContent } = submitConf
    const now = Date.now()
    if (now < new Date(begTime).getTime()) {
      router.push({ name: 'errorPage' })
      Object.assign(errorInfo, {
        errorType: 'overTime',
        errorMsg: `<p>问卷未到开始填写时间，暂时无法进行填写<p/>
                   <p>开始时间为: ${begTime}</p>`
      })
      return
    } else if (now > new Date(endTime).getTime()) {
      router.push({ name: 'errorPage' })
      Object.assign(errorInfo, {
        errorType: 'overTime',
        errorMsg: msgContent.msg_9001 || '您来晚了，感谢支持问卷~'
      })
      return
    } else if (answerBegTime && answerEndTime) {
      const momentNow = moment()
      const todayStr = momentNow.format('yyyy-MM-DD')
      const momentStartTime = moment(`${todayStr} ${answerBegTime}`)
      const momentEndTime = moment(`${todayStr} ${answerEndTime}`)
      if (momentNow.isBefore(momentStartTime) || momentNow.isAfter(momentEndTime)) {
        router.push({ name: 'errorPage' })
        Object.assign(errorInfo, {
          errorType: 'overTime',
          errorMsg: `<p>不在答题时间范围内，暂时无法进行填写<p/>
                    <p>答题时间为: ${answerBegTime} ~ ${answerEndTime}</p>`
        })
        return
      }
    }
    router.push({ name: 'renderPage' })

    // 根据初始的schema生成questionData, questionSeq, rules, formValues, 这四个字段
    const { questionData, questionSeq, rules, formValues } = adapter.generateData({
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf
    })
    // 将数据设置到state上
    state.questionData = questionData
    state.questionSeq = questionSeq
    state.rules = rules
    state.formValues = formValues
    state.bannerConf = bannerConf
    state.baseConf = baseConf
    state.bottomConf = bottomConf
    state.dataConf = dataConf
    state.skinConf = skinConf
    state.submitConf = submitConf
    // 获取已投票数据
    initVoteData()
  }

  // 用户输入或者选择后，更新表单数据
  function changeData(data) {
    let { key, value } = data
    set(state, `formValues.${key}`, value)
  }

  // 初始化投票题的数据
  async function initVoteData() {
    const questionData = state.questionData
    const fieldList = []

    for (const field in questionData) {
      const { type } = questionData[field]
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
        surveyPath: surveyPath.value,
        fieldList: fieldList.join(',')
      })

      if (voteRes.code === 200) {
        localStorage.setItem(
          VOTE_INFO_KEY,
          JSON.stringify({
            ...voteRes.data
          })
        )
        voteMap.value = voteRes.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  function updateVoteData(data) {
    const { key: questionKey, value: questionVal } = data
    // 更新前获取接口缓存在localStorage中的数据
    const localData = localStorage.getItem(VOTE_INFO_KEY)
    const voteinfo = JSON.parse(localData)
    const currentQuestion = state.questionData[questionKey]
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

  function updateVoteMapByKey(data) {
    const { questionKey, voteKey, voteValue } = data
    // 兼容为空的情况
    if (!voteMap.value[questionKey]) {
      voteMap.value[questionKey] = {}
    }
    voteMap.value[questionKey][voteKey] = voteValue
  }

  async function getEncryptInfo() {
    try {
      const res = await fetchEncryptInfo()
      if (res.code === CODE_MAP.SUCCESS) {
        encryptInfo.value = res.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function initRuleEngine(ruleConf) {
    const _ruleEngine = new RuleMatch(ruleConf)

    ruleEngine.value = _ruleEngine
  }


  return {
    surveyPath,
    questionData,
    isMobile,
    errorInfo,
    enterTime,
    questionSeq,
    voteMap,
    encryptInfo,
    ruleEngine,
    renderData,
    state,
    init,
    changeData,
    updateVoteData,
    getEncryptInfo,
    initRuleEngine,
  }
})