import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '多行输入框',
  type: 'textarea',
  componentName: 'TextareaModule',
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
      defaultValue: 'textarea'
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
      name: 'placeholder',
      propType: String,
      description: '这是用于描述引导提示文案',
      defaultValue: ''
    },
    {
      name: 'valid',
      propType: String,
      description: '这是用于描述内容限制格式',
      defaultValue: ''
    },
    {
      name: 'numberRange',
      propType: Object,
      description: '这是用于数字限制',
      defaultValue: {
        max: {
          placeholder: '1000',
          value: 1000
        },
        min: {
          placeholder: '0',
          value: 0
        }
      }
    },
    {
      name: 'textRange',
      propType: Object,
      description: '这是用于字数限制',
      defaultValue: {
        max: {
          placeholder: '500',
          value: 500
        },
        min: {
          placeholder: '0',
          value: 0
        }
      }
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'valid',
      title: '内容限制格式',
      type: 'SelectSetter',
      key: 'valid',
      options: [
        {
          label: '请选择',
          value: ''
        },
        {
          label: '手机号',
          value: 'm'
        },
        {
          label: '身份证',
          value: 'idcard'
        },
        {
          label: '数字',
          value: 'n'
        },
        {
          label: '邮箱',
          value: 'e'
        },
        {
          label: '车牌号',
          value: 'licensePlate'
        }
      ]
    },
    {
      name: 'numberRange',
      title: '数字限制',
      type: 'RangeSetter',
      key: 'numberRange',
      value: [],
      relyFunc: (data) => data.valid && data.valid === 'n'
    },
    {
      name: 'textRange',
      title: '字数限制',
      type: 'RangeSetter',
      key: 'textRange',
      value: []
    },
    {
      name: 'placeholder',
      title: '引导提示文案',
      type: 'InputSetter',
      placeholder: '限制20字',
      key: 'placeholder',
      tip: '限制20字',
      validate(value) {
        if (value && value.length > 20) {
          return false
        }
        return true
      }
    }
  ]
}
export default meta
