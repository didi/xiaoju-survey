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
  interview_pwd_switch: {
    key: 'baseConf.passwordSwitch',
    label: '访问密码',
    type: 'CustomedSwitch'
  },
  interview_pwd: {
    key: 'baseConf.password',
    type: 'InputSetter',
    placeholder: '请输入6位字符串类型访问密码 ',
    maxLength: 6,
    relyFunc: (data) => {
      return !!data?.passwordSwitch
    }
  },
  answer_type: {
    key: 'baseConf.whitelistType',
    label: '答题名单',
    type: 'RadioGroup',
    options: [
      {
        label: '所有人',
        value: 'ALL'
      },
      {
        label: '空间成员',
        value: 'MEMBER'
      },
      {
        label: '白名单',
        value: 'CUSTOM'
      }
    ]
  },
  white_placeholder: {
    key: 'baseConf.whitelistTip',
    label: '名单登录提示语',
    placeholder: '请输入名单提示语',
    type: 'InputSetter',
    maxLength: 40,
    relyFunc: (data) => {
      return ['CUSTOM', 'MEMBER'].includes(data.whitelistType)
    }
  },
  white_list: {
    keys: ['baseConf.whitelist', 'baseConf.memberType'],
    label: '白名单列表',
    type: 'WhiteList',
    custom: true, // 自定义导入高级组件
    relyFunc: (data) => {
      return data.whitelistType === 'CUSTOM'
    }
  },
  team_list: {
    key: 'baseConf.whitelist',
    label: '团队空间成员选择',
    type: 'TeamMemberList',
    custom: true, // 自定义导入高级组件
    relyFunc: (data) => {
      return data.whitelistType === 'MEMBER'
    }
  }
}
