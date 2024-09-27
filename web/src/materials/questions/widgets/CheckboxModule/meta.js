import basicConfig from '@materials/questions/common/config/basicConfig'
const meta = {
  title: '多选',
  type: 'checkbox',
  componentName: 'CheckBoxModule',
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
      defaultValue: 'checkbox'
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
      name: 'options',
      propType: Array,
      description: '这是用于描述选项',
      defaultValue: [
        {
          text: '选项1',
          others: false,
          mustOthers: false,
          othersKey: '',
          placeholderDesc: '',
          hash: '115019'
        },
        {
          text: '选项2',
          others: false,
          mustOthers: false,
          othersKey: '',
          placeholderDesc: '',
          hash: '115020'
        }
      ]
    },
    {
      name: 'minNum',
      propType: Number,
      description: '最少选择数',
      defaultValue: 0
    },
    {
      name: 'maxNum',
      propType: Number,
      description: '最多选择数',
      defaultValue: 0
    },
    {
      name: 'layout',
      propType: String,
      description: '排列方式',
      defaultValue: 'vertical'
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'optionConfig',
      title: '选项配置',
      type: 'Customed',
      content: [
        {
          label: '排列方式',
          type: 'RadioGroup',
          key: 'layout',
          value: 'vertical',
          options: [
            {
              label: '竖排',
              value: 'vertical'
            },
            {
              label: '横排',
              value: 'horizontal'
            }
          ]
        },
        {
          label: '至少选择数',
          type: 'InputNumber',
          key: 'minNum',
          value: 0,
          min: 0,
          max: (moduleConfig) => {
            return moduleConfig?.maxNum || 0
          },
          contentClass: 'input-number-config'
        },
        {
          label: '最多选择数',
          type: 'InputNumber',
          key: 'maxNum',
          value: 0,
          min: (moduleConfig) => {
            return moduleConfig?.minNum || 0
          },
          max: (moduleConfig) => {
            return moduleConfig?.options?.length
          },
          contentClass: 'input-number-config'
        },
      ]
    },
  ],
  editConfigure: {
    optionEdit: {
      show: true
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: true,
        showAdvancedConfig: true
      }
    }
  }
}

export default meta
