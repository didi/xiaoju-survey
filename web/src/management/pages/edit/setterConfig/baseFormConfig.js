// 问卷设置，定义了字段和对应的设置器
export default {
  base_effectTime: {
    keys: ['beginTime', 'endTime'],
    label: '答题有效期',
    type: 'QuestionTime',
    placeholder: 'yyyy-MM-dd hh:mm:ss'
  },
  limit_tLimit: {
    key: 'tLimit',
    label: '问卷回收总数',
    type: 'InputNumber',
    tip: '0为无限制，此功能用于限制该问卷总提交的数据量。当数据量达到限额时，该问卷将不能继续提交',
    tipShow: true,
    placement: 'top',
    min: 0
  },
  limit_answerTime: {
    keys: ['answerBegTime', 'answerEndTime'],
    label: '答题时段',
    tip: '问卷仅在指定时间段内可填写',
    type: 'QuestionTimeHour',
    placement: 'top'
  },
  limit_fillAnswer: {
    key: 'fillAnswer',
    label: '允许断点续答',
    tip: '回填前一次作答中的内容（注：更换设备/浏览器/清除缓存/更改内容重新发布则此功能失效）',
    placement: 'top',
    type: 'CustomedSwitch'
  },
  limit_fillSubmitAnswer: {
    key: 'fillSubmitAnswer',
    label: '自动填充上次提交内容',
    tip: '回填前一次提交的内容（注：更换设备/浏览器/清除缓存/更改内容重新发布则此功能失效）',
    placement: 'top',
    type: 'CustomedSwitch'
  },
  interview_pwd_switch: {
    key: 'passwordSwitch',
    label: '访问密码',
    type: 'CustomedSwitch'
  },
  interview_pwd: {
    key: 'password',
    type: 'InputSetter',
    placeholder: '请输入6位字符串类型访问密码 ',
    maxLength: 6,
    relyFunc: (data) => {
      return !!data?.passwordSwitch
    }
  },
  answer_type: {
    key: 'whitelistType',
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
    ],
    // 批量修改value
    valueSetter(data) {
      return [
        data,
        {
          key: 'whitelistTip', // 切换tab清空名单登录提示语
          value: ''
        },
        {
          key: 'whitelist', // 切换tab清空名单列表
          value: []
        },
        {
          key: 'memberType',
          value: ''
        }
      ]
    }
  },
  white_placeholder: {
    key: 'whitelistTip',
    label: '名单登录提示语',
    placeholder: '请输入名单提示语',
    type: 'InputSetter',
    maxLength: 40,
    relyFunc: (data) => {
      return ['CUSTOM', 'MEMBER'].includes(data.whitelistType)
    }
  },
  white_list: {
    keys: ['whitelist', 'memberType'],
    label: '白名单列表',
    type: 'WhiteList',
    custom: true, // 自定义导入高级组件
    relyFunc: (data) => {
      return data.whitelistType === 'CUSTOM'
    }
  },
  team_list: {
    key: 'whitelist',
    label: '团队空间成员选择',
    type: 'TeamMemberList',
    custom: true, // 自定义导入高级组件
    relyFunc: (data) => {
      return data.whitelistType === 'MEMBER'
    }
  },
}
