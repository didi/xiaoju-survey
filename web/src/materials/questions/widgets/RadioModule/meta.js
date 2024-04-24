import basicConfig from '../../common/config/basicConfig'

const meta = {
  title: '单选',
  questExtra: ['listenMerge'],
  type: 'radio',
  props: [
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
      defaultValue: '标题一'
    },
    {
      name: 'extraOptions',
      propType: Array,
      description: '这是用于固定选项配置',
      defaultValue: []
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
