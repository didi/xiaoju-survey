import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '评分',
  type: 'radio-star',
  componentName: 'StarModule',
  attrs: [
    {
      name: 'field',
      propType: 'String',
      description: '这是用于描述题目id',
      defaultValue: ''
    },
    {
      name: 'title',
      propType: 'String',
      description: '这是用于描述题目标题',
      defaultValue: '标题一'
    },
    {
      name: 'type',
      propType: 'String',
      description: '这是用于描述题目类型',
      defaultValue: 'radio-star'
    },
    {
      name: 'isRequired',
      propType: Boolean,
      description: '是否必填',
      defaultValue: true
    },
    {
      name: 'showIndex',
      propType: Boolean,
      description: '显示序号',
      defaultValue: true
    },
    {
      name: 'showType',
      propType: Boolean,
      description: '显示类型',
      defaultValue: true
    },
    {
      name: 'showSpliter',
      propType: Boolean,
      description: '显示分割线',
      defaultValue: true
    },
    {
      name: 'starMin',
      propType: Number,
      description: '这是用于描述评分最小值',
      defaultValue: 1
    },
    {
      name: 'starMax',
      propType: Number,
      description: '这是用于描述评分最大值',
      defaultValue: 5
    },
    {
      name: 'starStyle',
      propType: String,
      description: '',
      defaultValue: 'star'
    },
    {
      name: 'rangeConfig',
      propType: Object,
      description: '这是用于描述评分高级设置',
      defaultValue: {}
    }
  ],
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
        showAdvancedConfig: true
      }
    }
  }
}

export default meta
