export default [
  {
    label: '提交按钮文案',
    type: 'Input',
    key: 'submitTitle',
    placeholder: '提交',
    value: '',
    labelStyle: {
      fontWeight: 'bold',
    },
  },
  {
    label: '提交确认弹窗',
    type: 'Customed',
    key: 'confirmAgain',
    labelStyle: {
      fontWeight: 'bold',
    },
    content: [
      {
        label: '是否配置该项',
        type: 'CustomedSwitch',
        key: 'confirmAgain.is_again',
        direction: 'horizon',
        value: true,
      },
      {
        label: '二次确认文案',
        type: 'Input',
        key: 'confirmAgain.again_text',
        direction: 'horizon',
        placeholder: '确认要提交吗？',
        value: '确认要提交吗？',
      },
    ],
  },
  {
    label: '提交文案配置',
    type: 'Customed',
    key: 'msgContent',
    labelStyle: {
      fontWeight: 'bold',
    },
    content: [
      {
        label: '已提交',
        type: 'Input',
        key: 'msgContent.msg_9002',
        placeholder: '请勿多次提交！',
        value: '请勿多次提交！',
        direction: 'horizon',
      },
      {
        label: '提交结束',
        type: 'Input',
        key: 'msgContent.msg_9003',
        placeholder: '您来晚了，已经满额！',
        value: '您来晚了，已经满额！',
        direction: 'horizon',
      },
      {
        label: '其他提交失败',
        type: 'Input',
        key: 'msgContent.msg_9004',
        placeholder: '提交失败！',
        value: '提交失败！',
        direction: 'horizon',
      },
    ],
  },
]
