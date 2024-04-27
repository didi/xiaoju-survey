export default [
  {
    title: '提交按钮文案',
    type: 'InputSetter',
    key: 'submitTitle',
    placeholder: '提交',
    value: ''
  },
  {
    title: '提交确认弹窗',
    type: 'Customed',
    key: 'confirmAgain',
    content: [
      {
        label: '是否配置该项',
        labelStyle: { width: '120px' },
        type: 'CustomedSwitch',
        key: 'confirmAgain.is_again',
        value: true
      },
      {
        label: '二次确认文案',
        labelStyle: { width: '120px' },
        type: 'InputSetter',
        key: 'confirmAgain.again_text',
        placeholder: '确认要提交吗？',
        value: '确认要提交吗？'
      }
    ]
  },
  {
    title: '提交文案配置',
    type: 'Customed',
    key: 'msgContent',
    content: [
      {
        label: '已提交',
        labelStyle: { width: '120px' },
        type: 'InputSetter',
        key: 'msgContent.msg_9002',
        placeholder: '请勿多次提交！',
        value: '请勿多次提交！'
      },
      {
        label: '提交结束',
        labelStyle: { width: '120px' },
        type: 'InputSetter',
        key: 'msgContent.msg_9003',
        placeholder: '您来晚了，已经满额！',
        value: '您来晚了，已经满额！'
      },
      {
        label: '其他提交失败',
        labelStyle: { width: '120px' },
        type: 'InputSetter',
        key: 'msgContent.msg_9004',
        placeholder: '提交失败！',
        value: '提交失败！'
      }
    ]
  }
]
