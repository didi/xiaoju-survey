// 问卷设置，定义了字段和对应的设置器
export default {
  base_effectTime: {
    keys: ['baseConf.begTime', 'baseConf.endTime'],
    label: '答题有效期',
    type: 'QuestionTime',
    placeholder: 'yyyy-MM-dd hh:mm:ss',
    // direction: 'horizon',
  },
  // base_showVote: {
  //   key: 'baseConf.showVoteProcess',
  //   label: '投票配置',
  //   type: 'Select',
  //   direction: 'horizon',
  //   tip: '是否实时展示投票进度',
  //   placement: 'top',
  //   options: [
  //     {
  //       label: '实时展示投票进度',
  //       value: 'allow',
  //     },
  //     {
  //       label: '提交后才可以查看进度',
  //       value: 'notallow',
  //     },
  //     {
  //       label: '不展示投票进度',
  //       value: 'never',
  //     },
  //   ],
  // },
  // base_shortestTime: {
  //   key: 'baseConf.shortestTime',
  //   label: '最短答题时长(分钟)',
  //   type: 'InputNumber',
  //   direction: 'horizon',
  //   tip: '问卷仅可在所设置的时间之后才能进行提交，0为无限制',
  //   tipShow: true,
  //   placement: 'top',
  // },
  limit_tLimit: {
    key: 'baseConf.tLimit',
    label: '问卷回收总数',
    type: 'InputNumber',
    // direction: 'horizon',
    tip: '0为无限制，此功能用于限制该问卷总提交的数据量。当数据量达到限额时，该问卷将不能继续提交',
    tipShow: true,
    placement: 'top',
    min: 0,
  },
  limit_answerTime: {
    keys: ['baseConf.answerBegTime', 'baseConf.answerEndTime'],
    label: '答题时段',
    tip: '问卷仅在指定时间段内可填写',
    type: 'QuestionTimeHour',
    // direction: 'horizon',
    placement: 'top',
  },
  // skin_skinColor: {
  //   key: 'skinConf.skinColor',
  //   label: '页面主题颜色',
  //   type: 'Select',
  //   direction: 'horizon',
  //   options: [
  //     {
  //       label: '橘色主题',
  //       value: '#ff8a01',
  //     },
  //     {
  //       label: '深灰蓝主题',
  //       value: '#4a4c5b',
  //     },
  //   ],
  // },
  // skin_inputBgColor: {
  //   key: 'skinConf.inputBgColor',
  //   label: '输入框底色',
  //   type: 'ColorInput',
  //   direction: 'horizon',
  //   maxlength: 6,
  // },
};
