import { defineStore } from 'pinia'
import { ref, reactive, toRef, computed } from 'vue'
import { getSurveyById } from '@/management/api/survey'
import { merge as _merge, cloneDeep as _cloneDeep, set as _set } from 'lodash-es'
import { getNewField } from '@/management/utils'
import submitFormConfig from '@/management/config/setterConfig/submitConfig'
import questionLoader from '@/materials/questions/questionLoader'

const innerMetaConfig = {
  submit: {
    title: '提交配置',
    formConfig: submitFormConfig
  }
}

function useInitializeSchema(surveyId) {
  const schema = reactive({
    metaData: null,
    bannerConf: {
      titleConfig: {
        mainTitle: '<h3 style="text-align: center">欢迎填写问卷</h3>',
        subTitle: `<p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style="color: rgb(204, 0, 0)">期待您的参与！</span></p>`,
        applyTitle: ''
      },
      bannerConfig: {
        bgImage: '',
        bgImageAllowJump: false,
        bgImageJumpLink: '',
        videoLink: '',
        postImg: ''
      }
    },
    bottomConf: {
      logoImage: '',
      logoImageWidth: '28%'
    },
    skinConf: {
      backgroundConf: {
        color: '#fff'
      },
      themeConf: {
        color: '#ffa600'
      },
      contentConf: {
        opacity: 100
      }
    },
    baseConf: {
      begTime: '',
      endTime: '',
      language: 'chinese',
      showVoteProcess: 'allow',
      tLimit: 0,
      answerBegTime: '',
      answerEndTime: '',
      answerLimitTime: 0
    },
    submitConf: {
      submitTitle: '',
      msgContent: {},
      confirmAgain: {
        is_again: true
      },
      link: ''
    },
    questionDataList: [],
    logicConf: {
      showLogicConf: []
    }
  })

  function initSchema({ metaData, codeData }) {
    schema.metaData = metaData
    schema.bannerConf = _merge({}, schema.bannerConf, codeData.bannerConf)
    schema.bottomConf = _merge({}, schema.bottomConf, codeData.bottomConf)
    schema.skinConf = _merge({}, schema.skinConf, codeData.skinConf)
    schema.baseConf = _merge({}, schema.baseConf, codeData.baseConf)
    schema.submitConf = _merge({}, schema.submitConf, codeData.submitConf)
    schema.questionDataList = codeData.questionDataList || []
    schema.logicConf = codeData.logicConf

    console.log(metaData, codeData)
  }

  async function getSchemaFromRemote() {
    const res = await getSurveyById(surveyId.value)
    if (res.code === 200) {
      const metaData = res.data.surveyMetaRes
      document.title = metaData.title
      const {
        bannerConf,
        bottomConf,
        skinConf,
        baseConf,
        submitConf,
        dataConf,
        logicConf = {}
      } = res.data.surveyConfRes.code
      initSchema({
        metaData,
        codeData: {
          bannerConf,
          bottomConf,
          skinConf,
          baseConf,
          submitConf,
          questionDataList: dataConf.dataList,
          logicConf
        }
      })
    } else {
      throw new Error(res.errmsg || '问卷不存在')
    }
  }

  return {
    schema,
    initSchema,
    getSchemaFromRemote
  }
}

function useQuestionDataListOperations(questionDataList, updateTime) {
  function copyQuestion({ index }) {
    const newQuestion = _cloneDeep(questionDataList.value[index])
    newQuestion.field = getNewField(questionDataList.value.map((item) => item.field))
    addQuestion({ question: newQuestion, index })
  }

  function addQuestion({ question, index }) {
    questionDataList.value.splice(index, 0, question)
    updateTime()
  }

  function deleteQuestion({ index }) {
    questionDataList.value.splice(index, 1)
    updateTime()
  }

  function moveQuestion({ index, range }) {
    console.log('move')
    let start, end
    if (range < 0) {
      // 向上移动
      start = index + range
      end = index
    } else if (range > 0) {
      // 向下移动
      start = index + 1
      end = index + range + 1
    } else {
      // 无变化
      return
    }
    const currentData = questionDataList.value[index]
    // 新位置和老位置之间所有的题目
    const comparedList = questionDataList.value.slice(start, end)
    if (range < 0) {
      // 向上移动
      questionDataList.value.splice(index + range, 1 - range, currentData, ...comparedList)
    } else if (range > 0) {
      // 向下移动
      questionDataList.value.splice(index, range + 1, ...comparedList, currentData)
    }
    updateTime()
  }

  return {
    copyQuestion,
    addQuestion,
    deleteQuestion,
    moveQuestion,
  }
}

function useCurrentEdit({
  schema,
  questionDataList,

}) {
  const currentEditOne = ref()
  const currentEditStatus = ref('Success')

  const currentEditKey = computed(() => {
    if (currentEditOne.value === null) {
      return null
    }
    let key = ''
    switch (currentEditOne.value) {
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
        key = `questionDataList.${currentEditOne.value}`
    }
    return key
  })

  const moduleConfig = computed(() => {
    if (currentEditOne.value === null) {
      return null
    }

    if (currentEditOne.value === 'banner' || currentEditOne.value === 'mainTitle') {
      return schema?.bannerConf
    } else if (currentEditOne.value === 'submit') {
      return schema?.submitConf
    } else if (currentEditOne.value === 'logo') {
      return schema?.bottomConf
    } else if (!Number.isNaN(currentEditOne.value)) {
      return questionDataList.value?.[currentEditOne.value]
    } else {
      return null
    }
  })

  const formConfigList = computed(() => {
    if (currentEditOne.value === null) {
      return null
    }

    return currentEditMeta.value?.formConfig || []
  })

  const currentEditMeta = computed(() => {
    if (currentEditOne.value === null) {
      return null
    } else if (innerMetaConfig[currentEditOne.value]) {
      return innerMetaConfig[currentEditOne.value]
    } else {
      const questionType = questionDataList.value?.[currentEditOne.value]?.type
      return questionLoader.getMeta(questionType)
    }
  })

  return {
    currentEditOne,
    currentEditKey,
    currentEditStatus,
    moduleConfig,
    formConfigList,
    currentEditMeta
  }
}


export const useEditStore = defineStore('edit', () => {
  const surveyId = ref('')
  const schemaUpdateTime = ref(Date.now())
  const { schema, initSchema, getSchemaFromRemote } = useInitializeSchema(surveyId)
  const questionDataList = toRef(schema, 'questionDataList');
  const { currentEditOne,
    currentEditKey,
    currentEditStatus,
    moduleConfig,
    formConfigList,
    currentEditMeta } = useCurrentEdit({ schema, questionDataList })

  async function init() {
    const { metaData } = schema;
    if (!metaData || metaData?._id !== surveyId.value) {
      getSchemaFromRemote()
    }
    currentEditOne.value = null
    currentEditStatus.value = 'Success'
  }

  function updateTime() {
    schemaUpdateTime.value = Date.now()
  }


  const { copyQuestion,
    addQuestion,
    deleteQuestion,
    moveQuestion, } = useQuestionDataListOperations(questionDataList, updateTime)

  function changeSchema({ key, value }) {
    _set(schema, key, value)
    updateTime()
  }

  function changeThemePreset(presets) {
    Object.keys(presets).forEach((key) => {
      _set(schema, key, presets[key])
    })
  }


  return {
    surveyId,
    currentEditOne,
    moduleConfig,
    formConfigList,
    currentEditKey,
    currentEditStatus,
    currentEditMeta,
    schemaUpdateTime,
    schema,
    questionDataList,
    init,
    initSchema,
    getSchemaFromRemote,
    copyQuestion,
    addQuestion,
    deleteQuestion,
    moveQuestion,
    changeSchema,
    changeThemePreset
  }
})