import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '图片上传',
  type: 'image-upload',
  componentName: 'ImageUploadModule',
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
      defaultValue: 'image-upload'
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
      defaultValue: false
    },
    {
      name: 'showSpliter',
      propType: Boolean,
      description: '显示分割线',
      defaultValue: true
    },
    {
      name: 'maxImageCount',
      propType: Number,
      description: '最多上传图片数量',
      defaultValue: 5
    },
    {
      name: 'maxFileSize',
      propType: Number,
      description: '单张图片最大大小（MB）',
      defaultValue: 100
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'uploadLimitConfig',
      title: '上传限制',
      type: 'Customed',
      content: [
        {
          label: '最多张数',
          type: 'Select',
          key: 'maxImageCount',
          value: 5,
          options: Array.from({ length: 10 }, (_, i) => ({
            label: `${i + 1} 张`,
            value: i + 1
          }))
        },
        {
          label: '单张大小上限（MB）',
          type: 'NumberInput',
          key: 'maxFileSize',
          value: 100,
          min: 1,
          max: 100
        }
      ]
    }
  ],
  editConfigure: {
    optionEdit: {
      show: false
    },
    optionEditBar: {
      show: false,
      configure: {
        showOthers: false,
        showAdvancedConfig: false
      }
    }
  }
}

export default meta
