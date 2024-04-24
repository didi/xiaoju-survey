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
    // {
    //   name: 'fieldId',
    //   label: '题目ID',
    //   type: 'InputSetter',
    //   placeholder: '',
    //   key: 'field',
    //   tip: '请谨慎修改题目ID，并保证此ID在整个问卷中唯一',
    //   relyField: 'questionIdCustomize',
    //   noNeedRelyClean: true,
    // },
    // {
    //   name: 'questionLabel',
    //   label: '题目标签',
    //   type: 'InputSetter',
    //   placeholder: '',
    //   key: 'label',
    //   tip: '请谨慎修改题目标签，并保证此标签在整个问卷中唯一',
    //   relyField: 'questionLabelCustomize',
    //   noNeedRelyClean: true,
    // },
    // {
    //   name: 'titleOrigin',
    //   label: '标题引用其他题目选项',
    //   type: 'TitleOrigin',
    //   options: [],
    //   key: 'title',
    // },
    basicConfig,
    // {
    //   name: 'optionOrigin',
    //   label: '选项引用其他题目选项',
    //   type: 'SelectSetter',
    //   options: [],
    //   key: 'optionOrigin',
    //   tip: '支持引用多选题、单选题、矩阵单选题',
    // },
    // {
    //   name: 'originType',
    //   label: '',
    //   type: 'SelectSetter',
    //   options: [
    //     {
    //       label: '选中项',
    //       value: 'selected',
    //     },
    //     {
    //       label: '未选中项',
    //       value: 'noSelected',
    //     },
    //   ],
    //   key: 'originType',
    // },
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
