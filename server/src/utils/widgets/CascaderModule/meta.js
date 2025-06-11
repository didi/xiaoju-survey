import basicConfig from '../../basicConfig'


const meta = {
  title: '多级联动',
  type: 'cascader',
  componentName: 'CascaderModule',
  attrs: [
    {
      name: 'type',
      propType: 'String',
      description: '这是用于描述题目类型',
      defaultValue: 'cascader'
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
      name: 'cascaderData',
      propType: Array,
      description: '这是用于描述选项',
      defaultValue:
      {
        placeholder: [{
          text: '请选择',
          hash: '115016'
        }, {
          text: '请选择',
          hash: '115017'
        }, {
          text: '请选择',
          hash: '115018'
        }],
        children: [
          {
            text: '选项1',
            children: [],
            hash: '115019'
          },
          {
            text: '选项2',
            children: [],
            hash: '115020'
          },
          {
            text: '选项3',
            children: [],
            hash: '115011'
          }
        ]
      },


    },
  ],
  formConfig: [
    basicConfig
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
