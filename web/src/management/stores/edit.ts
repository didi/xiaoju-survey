import { type Ref, ref, reactive, toRef, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  merge as _merge,
  cloneDeep as _cloneDeep,
  set as _set,
  isNumber as _isNumber
} from 'lodash-es'
import { QUESTION_TYPE } from '@/common/typeEnum'
import { getQuestionByType } from '@/management/utils/index'
import { filterQuestionPreviewData } from '@/management/utils/index'

import { getSurveyById } from '@/management/api/survey'
import { getNewField } from '@/management/utils'

import submitFormConfig from '@/management/pages/edit/setterConfig/submitConfig'

import questionLoader from '@/materials/questions/questionLoader'
import { SurveyPermissions } from '@/management/utils/types/workSpace'
import { getBannerData } from '@/management/api/skin.js'
import { getCollaboratorPermissions } from '@/management/api/space'
import useEditGlobalBaseConf, { type TypeMethod } from './composables/useEditGlobalBaseConf'
import { CODE_MAP } from '../api/base'
import { RuleBuild } from '@/common/logicEngine/RuleBuild'
import { useShowLogicInfo } from '@/management/hooks/useShowLogicInfo'
import { useJumpLogicInfo } from '@/management/hooks/useJumpLogicInfo'
import { ElMessageBox } from 'element-plus'

const innerMetaConfig = {
  submit: {
    title: '提交配置',
    formConfig: submitFormConfig
  }
}

function useInitializeSchema(surveyId: Ref<string>, initializeSchemaCallBack: () => void) {
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
    pageEditOne: 1,
    pageConf: [], // 分页逻辑
    logicConf: {
      showLogicConf: [],
      jumpLogicConf: []
    }
  })
  const { showLogicEngine, initShowLogicEngine, jumpLogicEngine, initJumpLogicEngine } =
    useLogicEngine(schema)
  function initSchema({ metaData, codeData }: { metaData: any; codeData: any }) {
    schema.metaData = metaData
    schema.bannerConf = _merge({}, schema.bannerConf, codeData.bannerConf)
    schema.bottomConf = _merge({}, schema.bottomConf, codeData.bottomConf)
    schema.skinConf = _merge({}, schema.skinConf, codeData.skinConf)
    schema.baseConf = _merge({}, schema.baseConf, codeData.baseConf)
    schema.submitConf = _merge({}, schema.submitConf, codeData.submitConf)
    schema.questionDataList = codeData.questionDataList || []
    schema.logicConf = codeData.logicConf
    schema.pageEditOne = 1
    schema.pageConf = codeData.pageConf
  }

  async function getSchemaFromRemote() {
    const res: any = await getSurveyById(surveyId.value)
    if (res.code === 200) {
      const metaData = res.data.surveyMetaRes
      document.title = metaData.title
      const data = res.data.surveyConfRes.code
      const {
        bannerConf,
        bottomConf,
        skinConf,
        baseConf,
        submitConf,
        dataConf,
        logicConf = {}
      } = data
      if (!data.pageConf || data.pageConf.length === 0) {
        data.pageConf = [dataConf.dataList.length]
      }
      initSchema({
        metaData,
        codeData: {
          bannerConf,
          bottomConf,
          skinConf,
          baseConf,
          submitConf,
          questionDataList: dataConf.dataList,
          pageConf: data.pageConf,
          logicConf
        }
      })
      initializeSchemaCallBack()

      initShowLogicEngine()
      initJumpLogicEngine()
    } else {
      throw new Error(res.errmsg || '问卷不存在')
    }
  }

  return {
    schema,
    initSchema,
    getSchemaFromRemote,
    showLogicEngine,
    jumpLogicEngine
  }
}

function useQuestionDataListOperations({
  questionDataList,
  updateTime,
  pageOperations,
  updateCounts
}: {
  questionDataList: Ref<any[]>
  updateTime: () => void
  pageOperations: (type: string) => void
  updateCounts: (type: TypeMethod, data: any) => void
}) {
  function copyQuestion({ index }: { index: number }) {
    const newQuestion = _cloneDeep(questionDataList.value[index])
    newQuestion.field = getNewField(questionDataList.value.map((item) => item.field))
    addQuestion({ question: newQuestion, index })
  }

  function addQuestion({ question, index }: { question: any; index: number }) {
    questionDataList.value.splice(index, 0, question)
    pageOperations('add')
    updateTime()
    updateCounts('ADD', { question })
  }

  function deleteQuestion({ index }: { index: number }) {
    pageOperations('remove')
    const [question] = questionDataList.value.splice(index, 1)
    updateTime()
    updateCounts('REMOVE', { question })
  }

  function moveQuestion({ index, range }: { index: number; range: number }) {
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
    moveQuestion
  }
}

function useCurrentEdit({
  schema,
  questionDataList
}: {
  schema: any
  questionDataList: Ref<any[]>
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

  const currentEditMeta = computed(() => {
    if (currentEditOne.value === null) {
      return null
    } else if (innerMetaConfig[currentEditOne.value as keyof typeof innerMetaConfig]) {
      return innerMetaConfig[currentEditOne.value as keyof typeof innerMetaConfig]
    } else {
      const questionType = questionDataList.value?.[currentEditOne.value]?.type
      return questionLoader.getMeta(questionType)
    }
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

  function setCurrentEditOne(data: any) {
    currentEditOne.value = data
  }

  function changeCurrentEditStatus(status: string) {
    currentEditStatus.value = status
  }

  return {
    currentEditOne,
    currentEditKey,
    currentEditStatus,
    moduleConfig,
    formConfigList,
    currentEditMeta,
    setCurrentEditOne,
    changeCurrentEditStatus
  }
}

function usePageEdit(
  {
    schema,
    questionDataList
  }: {
    schema: any
    questionDataList: Ref<any[]>
  },
  updateTime: () => void
) {
  const pageConf = computed(() => schema.pageConf)
  const pageEditOne = computed(() => schema.pageEditOne)
  const isFinallyPage = computed(() => {
    return pageEditOne.value === pageConf.value.length
  })
  const pageCount = computed(() => pageConf.value.length || 0)

  const pageQuestionData = computed(() => {
    return getPageQuestionData(pageEditOne.value)
  })

  const getPageQuestionData = (index: number) => {
    const { startIndex, endIndex } = getSorter(index)
    return filterQuestionPreviewData(questionDataList.value).slice(startIndex, endIndex)
  }

  const getSorter = (index?: number) => {
    let startIndex = 0
    const newPageEditOne = index || pageEditOne.value
    const endIndex = pageConf.value[newPageEditOne - 1]

    for (let index = 0; index < pageConf.value.length; index++) {
      const item = pageConf.value[index]
      if (newPageEditOne - 1 == index) {
        break
      }
      startIndex += item
    }
    return {
      startIndex,
      endIndex: startIndex + endIndex
    }
  }

  const addPage = () => {
    schema.pageConf.push(1)
  }

  const updatePageEditOne = (index: number) => {
    schema.pageEditOne = index
  }

  const deletePage = (index: number) => {
    if (pageConf.value.length <= 1) return
    const { startIndex, endIndex } = getSorter(index)
    const newQuestionList = _cloneDeep(questionDataList.value)
    const deleteFields = newQuestionList
      .slice(startIndex, endIndex - startIndex)
      .map((i) => i.field)

    // 删除分页判断题目是否存在逻辑关联
    const hasLogic = deleteFields.filter((field) => {
      const { hasShowLogic } = useShowLogicInfo(field)
      const { hasJumpLogic } = useJumpLogicInfo(field)
      return hasShowLogic || hasJumpLogic
    })
    if (hasLogic.length) {
      ElMessageBox.alert('该分页下有题目被显示或跳转逻辑关联，请先清除', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      return
    }
    updatePageEditOne(1)
    newQuestionList.splice(startIndex, endIndex - startIndex)
    schema.pageConf.splice(index - 1, 1)
    questionDataList.value = newQuestionList
    updateTime()
  }

  const swapArrayRanges = (index: number, range: number) => {
    const { startIndex: start1, endIndex: end1 } = getSorter(index)
    const { startIndex: start2, endIndex: end2 } = getSorter(range)
    const newQuestion = _cloneDeep(questionDataList.value)
    const range1 = newQuestion.slice(start1, end1)
    const range2 = newQuestion.slice(start2, end2)
    newQuestion.splice(start1, range1.length, ...range2)
    newQuestion.splice(start2, range2.length, ...range1)
    questionDataList.value = newQuestion
    const rangeCount = schema.pageConf[range - 1]
    schema.pageConf[range - 1] = schema.pageConf[index - 1]
    schema.pageConf[index - 1] = rangeCount
    updateTime()
  }

  const copyPage = (index: number) => {
    const newQuestionList = _cloneDeep(getPageQuestionData(index))
    newQuestionList.forEach((item) => {
      item.field = getNewField(questionDataList.value.map((item) => item.field))
    })
    schema.pageConf.splice(index, 0, newQuestionList.length)
    const { endIndex } = getSorter(index)
    questionDataList.value.splice(endIndex, 0, ...newQuestionList)
    updateTime()
  }

  const pageOperations = (type: string) => {
    const count = pageConf.value[pageEditOne.value - 1]
    if (type == 'add') {
      if (count != undefined) {
        schema.pageConf[pageEditOne.value - 1] = count + 1
      }
      return
    }
    if (type == 'remove') {
      if (count) {
        schema.pageConf[pageEditOne.value - 1] = count - 1
      }
    }
  }

  const setPage = (data: Array<number>) => {
    for (let index = 0; index < pageConf.value.length; index++) {
      const newIndex = data[index]
      const oldIndex = pageConf.value[index]
      if (newIndex != oldIndex) {
        schema.pageConf[index] = newIndex
      }
    }
  }

  return {
    pageEditOne,
    pageConf,
    isFinallyPage,
    pageCount,
    pageQuestionData,
    getSorter,
    updatePageEditOne,
    deletePage,
    addPage,
    copyPage,
    getPageQuestionData,
    pageOperations,
    swapArrayRanges,
    setPage
  }
}

function useLogicEngine(schema: any) {
  const logicConf = toRef(schema, 'logicConf')
  const showLogicEngine = ref()
  const jumpLogicEngine = ref()
  function initShowLogicEngine() {
    showLogicEngine.value = new RuleBuild().fromJson(logicConf.value?.showLogicConf)
  }
  function initJumpLogicEngine() {
    jumpLogicEngine.value = new RuleBuild().fromJson(logicConf.value?.jumpLogicConf)
  }
  return {
    showLogicEngine,
    jumpLogicEngine,
    initShowLogicEngine,
    initJumpLogicEngine
  }
}
type IBannerItem = {
  name: string
  key: string
  list: Array<Object>
}
type IBannerList = Record<string, IBannerItem>
export const useEditStore = defineStore('edit', () => {
  const surveyId = ref('')
  const bannerList: Ref<IBannerList> = ref({})
  const cooperPermissions = ref(Object.values(SurveyPermissions))
  const schemaUpdateTime = ref(Date.now())
  const { schema, initSchema, getSchemaFromRemote, showLogicEngine, jumpLogicEngine } =
    useInitializeSchema(surveyId, () => {
      editGlobalBaseConf.initCounts()
    })
  const questionDataList = toRef(schema, 'questionDataList')

  const editGlobalBaseConf = useEditGlobalBaseConf(questionDataList, updateTime)
  function setQuestionDataList(data: any) {
    schema.questionDataList = data
  }

  function setSurveyId(id: string) {
    surveyId.value = id
  }

  const fetchBannerData = async () => {
    const res: any = await getBannerData()
    if (res.code === CODE_MAP.SUCCESS) {
      bannerList.value = res.data
    }
  }
  const fetchCooperPermissions = async (id: string) => {
    const res: any = await getCollaboratorPermissions(id)
    if (res.code === CODE_MAP.SUCCESS) {
      cooperPermissions.value = res.data.permissions
    }
  }
  // const { showLogicEngine, initShowLogicEngine, jumpLogicEngine, initJumpLogicEngine } = useLogicEngine(schema)
  const {
    currentEditOne,
    currentEditKey,
    currentEditStatus,
    moduleConfig,
    formConfigList,
    currentEditMeta,
    setCurrentEditOne,
    changeCurrentEditStatus
  } = useCurrentEdit({ schema, questionDataList })

  async function init() {
    const { metaData } = schema
    if (!metaData || (metaData as any)?._id !== surveyId.value) {
      await getSchemaFromRemote()
    }
    currentEditOne.value = null
    currentEditStatus.value = 'Success'
  }

  function updateTime() {
    schemaUpdateTime.value = Date.now()
  }

  const {
    pageEditOne,
    pageConf,
    isFinallyPage,
    pageCount,
    pageQuestionData,
    getSorter,
    updatePageEditOne,
    deletePage,
    pageOperations,
    addPage,
    getPageQuestionData,
    copyPage,
    swapArrayRanges,
    setPage
  } = usePageEdit({ schema, questionDataList }, updateTime)

  const { copyQuestion, addQuestion, deleteQuestion, moveQuestion } = useQuestionDataListOperations(
    {
      questionDataList,
      updateTime,
      pageOperations,
      updateCounts: editGlobalBaseConf.updateCounts
    }
  )

  function moveQuestionDataList(data: any) {
    const { startIndex, endIndex } = getSorter()
    const newData = [
      ...questionDataList.value.slice(0, startIndex),
      ...data,
      ...questionDataList.value.slice(endIndex)
    ]
    const countTotal: number = (schema.pageConf as Array<number>).reduce(
      (v: number, i: number) => v + i
    )
    if (countTotal != newData.length) {
      schema.pageConf[pageEditOne.value - 1] = (schema.pageConf[pageEditOne.value - 1] + 1) as never
    }
    setQuestionDataList(newData)
  }

  const compareQuestionSeq = (val: Array<any>) => {
    const newSeq: Array<string> = []
    const oldSeq: Array<string> = []
    let status = false
    val.map((v) => {
      newSeq.push(v.field)
    })
    ;(questionDataList.value as Array<any>).map((v) => {
      oldSeq.push(v.field)
    })
    for (let index = 0; index < newSeq.length; index++) {
      if (newSeq[index] !== oldSeq[index]) {
        status = true
        break
      }
    }
    if (status) {
      setQuestionDataList(val)
    }
  }

  const newQuestionIndex = computed(() => {
    if (_isNumber(currentEditOne.value)) {
      return currentEditOne.value + 1
    } else {
      const pageConf = schema.pageConf
      const questCount = pageConf[schema.pageEditOne - 1]
      const { startIndex, endIndex } = getSorter()
      if (!questCount) {
        return startIndex
      }
      return endIndex
    }
  })

  const createNewQuestion = ({ type }: { type: QUESTION_TYPE }) => {
    const fields = questionDataList.value.map((item: any) => item.field)
    const newQuestion = getQuestionByType(type, fields)
    newQuestion.title = newQuestion.title = `标题${newQuestionIndex.value + 1}`
    if (type === QUESTION_TYPE.VOTE) {
      newQuestion.innerType = QUESTION_TYPE.RADIO
    }
    return newQuestion
  }

  function changeSchema({ key, value }: { key: string; value: any }) {
    _set(schema, key, value)
    updateTime()
  }

  function changeThemePreset(presets: any) {
    Object.keys(presets).forEach((key) => {
      _set(schema, key, presets[key])
    })
  }

  return {
    editGlobalBaseConf,
    surveyId,
    setSurveyId,
    bannerList,
    fetchBannerData,
    cooperPermissions,
    fetchCooperPermissions,
    currentEditOne,
    moduleConfig,
    formConfigList,
    currentEditKey,
    currentEditStatus,
    currentEditMeta,
    newQuestionIndex,
    setCurrentEditOne,
    changeCurrentEditStatus,
    pageEditOne,
    pageConf,
    isFinallyPage,
    pageCount,
    pageQuestionData,
    getSorter,
    updatePageEditOne,
    deletePage,
    addPage,
    getPageQuestionData,
    copyPage,
    swapArrayRanges,
    setPage,
    schemaUpdateTime,
    schema,
    questionDataList,
    setQuestionDataList,
    moveQuestionDataList,
    init,
    initSchema,
    getSchemaFromRemote,
    copyQuestion,
    addQuestion,
    deleteQuestion,
    moveQuestion,
    createNewQuestion,
    changeSchema,
    changeThemePreset,
    compareQuestionSeq,
    showLogicEngine,
    jumpLogicEngine
  }
})
