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
          "text": "选项1",
          "imageUrl": "",
          "others": false,
          "mustOthers": false,
          "othersKey": "",
          "placeholderDesc": "",
          "hash": "115019"
        },
        {
          "text": "选项2",
          "imageUrl": "",
          "others": false,
          "mustOthers": false,
          "othersKey": "",
          "placeholderDesc": "",
          "hash": "115020"
        }
      ]
    },
    {
      name: 'quotaNoDisplay',
      propType: Boolean,
      description: '不展示配额剩余数量',
      defaultValue: false
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'optionsExtra',
      label: '固定选项配置',
      labelStyle: {
        'font-weight': 'bold'
      },
      type: 'Options',
      options: [],
      keys: 'extraOptions',
      hidden: true
    },
    {
      name: 'optionQuota',
      label: '选项配额',
      labelStyle: {
        'font-weight': 'bold'
      },
      type: 'QuotaConfig',
      // 输出转换
      valueSetter({ options, quotaNoDisplay}) {
        return [{
          key: 'options',
          value: options
        },
        {
          key: 'quotaNoDisplay',
          value: quotaNoDisplay
        }]
      }
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
