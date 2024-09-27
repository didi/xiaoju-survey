export default {
  Success: [
    {
      title: '提示文案',
      type: 'RichText',
      key: 'msgContent.msg_200',
      placeholder: '提交成功',
      value: '提交成功',
      labelStyle: {
        'font-weight': 'bold'
      }
    },
    {
      title: '交卷跳转',
      type: 'Customed',
      key: 'jumpConfig',
      content: [
        {
          key: 'jumpConfig.type',
          type: 'RadioGroup',
          value: 'link',
          options: [
            {
              label: '跳转网页',
              value: 'link'
            },
            {
              label: '跳转按钮',
              value: 'button'
            },
          ],
        },
        {
          key: 'jumpConfig.buttonText',
          label: '按钮文案',
          type: 'InputSetter',
          placeholder: '请输入按钮文案',
          value: '',
          toggleShowFn: (data) => {
            return data?.jumpConfig?.type === 'button'
          },
        },
        {
          key: 'jumpConfig.link',
          label: '跳转链接',
          type: 'InputSetter',
          placeholder: '请输入网址',
          value: '',
        },

      ]
    }
  ],
  OverTime: [
    {
      label: '提示文案',
      type: 'RichText',
      key: 'msgContent.msg_9001',
      placeholder: '问卷已过期',
      value: '问卷已过期',
      labelStyle: {
        'font-weight': 'bold'
      }
    }
  ]
}
