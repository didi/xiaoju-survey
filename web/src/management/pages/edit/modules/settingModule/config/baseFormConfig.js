// 问卷设置，定义了字段和对应的设置器
export default {
  base_effectTime: {
    keys: ['baseConf.begTime', 'baseConf.endTime'],
    label: '答题有效期',
    type: 'QuestionTime',
    placeholder: 'yyyy-MM-dd hh:mm:ss'
  },
  limit_tLimit: {
    key: 'baseConf.tLimit',
    label: '问卷回收总数',
    type: 'InputNumber',
    tip: '0为无限制，此功能用于限制该问卷总提交的数据量。当数据量达到限额时，该问卷将不能继续提交',
    tipShow: true,
    placement: 'top',
    min: 0
  },
  limit_answerTime: {
    keys: ['baseConf.answerBegTime', 'baseConf.answerEndTime'],
    label: '答题时段',
    tip: '问卷仅在指定时间段内可填写',
    type: 'QuestionTimeHour',
    placement: 'top'
  },
  limit_breakAnswer: {
    key: 'baseConf.breakAnswer',
    label: '允许断点续答',
    tip: '回填前一次作答中的内容（注：更换设备/浏览器/清除缓存/更改内容重新发布则此功能失效）',
    type: 'ELSwitch',
    value: false
  },
  limit_backAnswer: {
    key: 'baseConf.backAnswer',
    label: '自动填充上次填写内容',
    tip: '回填前一次提交的内容（注：更换设备/浏览器/清除缓存/更改内容重新发布则此功能失效）',
    type: 'ELSwitch',
    value: false
  }
}
