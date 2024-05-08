import basicConfig from '../../common/config/basicConfig'

const meta = {
  title: '评分',
  questExtra: ['listenMerge'],
  type: 'radio-star',
  componentName: 'StarModule',
  formConfig: [
    basicConfig,
    {
      name: 'starConfig',
      title: '评分显示样式',
      type: 'RadioGroup',
      key: 'starStyle',
      options: [
        {
          label: [1, 2, 3, 4, 5]
            .map(() => `<i class='qicon qicon-xingxing' style='margin-right: 4px;'></i>`)
            .join(''),
          value: 'star'
        },
        {
          label: [1, 2, 3, 4, 5]
            .map(() => `<i class='qicon qicon-aixin' style='margin-right: 4px;'></i>`)
            .join(''),
          value: 'love'
        },
        {
          label: `1  2  3  4  5`,
          value: 'number'
        }
      ]
    }
  ],
  editConfigure: {
    optionEdit: {
      show: false
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false,
        showAdvancedRateConfig: true
      }
    }
  }
}

export default meta
