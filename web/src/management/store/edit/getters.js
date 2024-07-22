import submitFormConfig from '@/management/pages/edit/setterConfig/submitConfig'
import questionLoader from '@/materials/questions/questionLoader'

const innerMetaConfig = {
  submit: {
    title: '提交配置',
    formConfig: submitFormConfig
  }
}

export default {
  moduleConfig(state) {
    const currentEditOne = state.currentEditOne
    if (currentEditOne === null) {
      return null
    }

    if (currentEditOne === 'banner' || currentEditOne === 'mainTitle') {
      return state?.schema?.bannerConf
    } else if (currentEditOne === 'submit') {
      return state?.schema?.submitConf
    } else if (currentEditOne === 'logo') {
      return state?.schema?.bottomConf
    } else if (!Number.isNaN(currentEditOne)) {
      return state?.schema?.questionDataList?.[currentEditOne]
    } else {
      return null
    }
  },
  formConfigList(state, getters) {
    const currentEditOne = state.currentEditOne
    if (currentEditOne === null) {
      return null
    }

    return getters?.currentEditMeta?.formConfig || []
  },
  currentEditMeta(state) {
    const currentEditOne = state.currentEditOne
    if (currentEditOne === null) {
      return null
    } else if (innerMetaConfig[currentEditOne]) {
      return innerMetaConfig[currentEditOne]
    } else {
      const questionType = state.schema?.questionDataList?.[currentEditOne]?.type
      return questionLoader.getMeta(questionType)
    }
  },
  currentEditKey(state) {
    const currentEditOne = state.currentEditOne
    if (currentEditOne === null) {
      return null
    }
    let key = ''
    switch (currentEditOne) {
      case 'banner':
      case 'mainTitle':
        key = 'bannerConf'
        break
      case 'submit':
        key = 'submitConf'
        break
      case 'logo':
        key = 'bottomConf'
        break
      default:
        key = `questionDataList.${currentEditOne}`
    }
    return key
  }
}
