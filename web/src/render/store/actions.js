import moment from 'moment';
import adapter from '../adapter';
import { queryVote, getEncryptInfo } from '@/render/api/survey';
import { CODE_MAP } from '@/management/api/base';

export default {
  // 初始化
  init(
    { commit, dispatch },
    { bannerConf, baseConf, bottomConf, dataConf, skinConf, submitConf }
  ) {
    commit('setEnterTime');
    const { begTime, endTime, answerBegTime, answerEndTime } = baseConf;
    const { msgContent } = submitConf;
    const now = Date.now();
    if (now < new Date(begTime).getTime()) {
      commit('setRouter', 'errorPage');
      commit('setErrorInfo', {
        errorType: 'overTime',
        errorMsg: `<p>问卷未到开始填写时间，暂时无法进行填写<p/>
                   <p>开始时间为: ${begTime}</p>`,
      });
      return;
    } else if (now > new Date(endTime).getTime()) {
      commit('setRouter', 'errorPage');
      commit('setErrorInfo', {
        errorType: 'overTime',
        errorMsg: msgContent.msg_9001 || '您来晚了，感谢支持问卷~',
      });
      return;
    } else if (answerBegTime && answerEndTime) {
      const momentNow = moment();
      const todayStr = momentNow.format('yyyy-MM-DD');
      const momentStartTime = moment(`${todayStr} ${answerBegTime}`);
      const momentEndTime = moment(`${todayStr} ${answerEndTime}`);
      if (
        momentNow.isBefore(momentStartTime) ||
        momentNow.isAfter(momentEndTime)
      ) {
        commit('setRouter', 'errorPage');
        commit('setErrorInfo', {
          errorType: 'overTime',
          errorMsg: `<p>不在答题时间范围内，暂时无法进行填写<p/>
                    <p>答题时间为: ${answerBegTime} ~ ${answerEndTime}</p>`,
        });
        return;
      }
    }
    commit('setRouter', 'indexPage');

    // 根据初始的schema生成questionData, questionSeq, rules, formValues, 这四个字段
    const { questionData, questionSeq, rules, formValues } =
      adapter.generateData({
        bannerConf,
        baseConf,
        bottomConf,
        dataConf,
        skinConf,
        submitConf,
      });

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
      formValues,
    });
    // 获取已投票数据
    dispatch('initVoteData');
  },
  // 用户输入或者选择后，更新表单数据
  changeData({ commit }, data) {
    commit('changeFormData', data);
  },
  // 初始化投票题的数据
  async initVoteData({ state, commit }) {
    const questionData = state.questionData;
    const surveyPath = state.surveyPath;

    const voteKeyList = [];

    for (const field in questionData) {
      const { type } = questionData[field];
      if (/vote/.test(type)) {
        voteKeyList.push(field);
      }
    }

    if (voteKeyList.length <= 0) {
      return;
    }
    const voteRes = await queryVote({
      surveyPath,
      voteKeyList: voteKeyList.join(','),
    });

    if (voteRes.code === 200) {
      commit('setVoteMap', voteRes.data);
    }
  },
  async getEncryptInfo({ commit }) {
    const res = await getEncryptInfo();
    if (res.code === CODE_MAP.SUCCESS) {
      commit('setEncryptInfo', res.data);
    }
  },
};
