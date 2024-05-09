import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '判断题',
  type: 'binary-choice',
  componentName: 'BinaryChoiceModule',
  formConfig: [basicConfig],
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
