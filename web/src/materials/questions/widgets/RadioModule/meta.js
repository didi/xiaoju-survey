import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '单选',
  type: 'radio',
  componentName: 'RadioModule',
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
      defaultValue: 'radio'
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
        }
      ]
    }
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
