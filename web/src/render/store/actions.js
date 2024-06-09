import moment from 'moment'
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn')
import adapter from '../adapter'
import { queryVote, getEncryptInfo } from '@/render/api/survey'
import { RuleMatch } from '@/common/logicEngine/RulesMatch'
/**
 * CODE_MAP不从management引入，在dev阶段，会导致B端 router被加载，进而导致C端路由被添加 baseUrl: /management
 */
const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NO_AUTH: 403
}
const VOTE_INFO_KEY = 'voteinfo'

export default {
  // 初始化
  init({ commit, dispatch }, { bannerConf, baseConf, bottomConf, dataConf, skinConf, submitConf }) {
    commit('setEnterTime')
    const { begTime, endTime, answerBegTime, answerEndTime } = baseConf
    const { msgContent } = submitConf
    const now = Date.now()
    if (now < new Date(begTime).getTime()) {
      commit('setRouter', 'errorPage')
      commit('setErrorInfo', {
        errorType: 'overTime',
        errorMsg: `<p>问卷未到开始填写时间，暂时无法进行填写<p/>
                   <p>开始时间为: ${begTime}</p>`
      })
      return
    } else if (now > new Date(endTime).getTime()) {
      commit('setRouter', 'errorPage')
      commit('setErrorInfo', {
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
        commit('setRouter', 'errorPage')
        commit('setErrorInfo', {
          errorType: 'overTime',
          errorMsg: `<p>不在答题时间范围内，暂时无法进行填写<p/>
                    <p>答题时间为: ${answerBegTime} ~ ${answerEndTime}</p>`
        })
        return
      }
    }
    commit('setRouter', 'indexPage')

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
    commit('assignState', {
      questionData,
      questionSeq,
      rules,
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf,
      formValues
    })
    // 获取已投票数据
    dispatch('initVoteData')
  },
  // 用户输入或者选择后，更新表单数据
  changeData({ commit }, data) {
    commit('changeFormData', data)
  },
  // 初始化投票题的数据
  async initVoteData({ state, commit }) {
    const questionData = state.questionData
    const surveyPath = state.surveyPath

    const fieldList = []

    for (const field in questionData) {
      const { type } = questionData[field]
      if (/vote/.test(type) || /radio/.test(type) || /checkbox/.test(type)) {
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
        commit('setVoteMap', voteRes.data)
      }
    } catch (error) {
      console.log(error)
    }
  },
  updateVoteData({ state, commit }, data) {
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
        commit('updateVoteMapByKey', countPayload)
      } else {
        const countPayload = {
          questionKey,
          voteKey: optionhash,
          voteValue: voteCount
        }
        commit('updateVoteMapByKey', countPayload)
      }
      commit('updateVoteMapByKey', totalPayload)
    })
  },
  async getEncryptInfo({ commit }) {
    try {
      const res = await getEncryptInfo()
      if (res.code === CODE_MAP.SUCCESS) {
        commit('setEncryptInfo', res.data)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async initRuleEngine({ commit }, ruleConf) {
    const ruleEngine = new RuleMatch(ruleConf)
    commit('setRuleEgine', ruleEngine)
  }
}
