import { ref, toRef, computed } from 'vue'
import { defineStore } from 'pinia'
import { set as _set, isNumber as _isNumber } from 'lodash-es'
import { QUESTION_TYPE } from '@/common/typeEnum'
import { getQuestionByType } from '@/management/utils/index'

import { SurveyPermissions } from '@/management/utils/workSpace'
import { getCollaboratorPermissions } from '@/management/api/space'

import useInitializeSchema from './composables/useInitializeSchema'
import useBaseConfig from './composables/useBaseConfig'
import useQuestionData from './composables/useQuestionData'
import useCurrentEdit from './composables/useCurrentEdit'
import usePageEdit from './composables/usePageEdit'

import { CODE_MAP } from '../api/base'

export const useEditStore = defineStore('edit', () => {
  const surveyId = ref('')
  function setSurveyId(id: string) {
    surveyId.value = id
  }

  // 初始化问卷内容
  const {
    schema,
    sessionId,
    initSessionId,
    getSchemaFromRemote,
    showLogicEngine,
    jumpLogicEngine
  } = useInitializeSchema(surveyId, () => {
    editGlobalBaseConf.initCounts()
  })
  async function init() {
    const { metaData } = schema
    if (!metaData || (metaData as any)?._id !== surveyId.value) {
      await Promise.all([getSchemaFromRemote(), initSessionId()])
    }
    currentEditOne.value = null
    currentEditStatus.value = 'Success'
  }

  // 问卷协作权限
  const cooperPermissions = ref(Object.values(SurveyPermissions))
  const fetchCooperPermissions = async (id: string) => {
    const res: any = await getCollaboratorPermissions(id)
    if (res.code === CODE_MAP.SUCCESS) {
      cooperPermissions.value = res.data.permissions
    }

    return res.data.permissions
  }

  // 问卷题目列表
  const questionDataList = toRef(schema, 'questionDataList')
  function setQuestionDataList(data: any) {
    schema.questionDataList = data
  }
  // 整卷配置
  const editGlobalBaseConf = useBaseConfig(questionDataList, updateTime)

  // 题目大纲移动题目顺序
  const compareQuestionSeq = (val: Array<any>) => {
    const newSeq: Array<string> = []
    const oldSeq: Array<string> = []
    let status = false
    for (const v of val) {
      newSeq.push(v.field)
    }
    for (const v of questionDataList.value as Array<any>) {
      oldSeq.push(v.field)
    }
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

  // 画布区域移动题目顺序
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

  // 问卷schema更新
  const schemaUpdateTime = ref(Date.now())
  function updateTime() {
    schemaUpdateTime.value = Date.now()
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

  // 分页相关
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
  // 增加新分页时新增题目
  const createNewQuestion = ({ type }: { type: QUESTION_TYPE }) => {
    const fields = questionDataList.value.map((item: any) => item.field)
    const newQuestion = getQuestionByType(type, fields)
    newQuestion.title = newQuestion.title = `标题${newQuestionIndex.value + 1}`
    if (type === QUESTION_TYPE.VOTE) {
      newQuestion.innerType = QUESTION_TYPE.RADIO
    }
    return newQuestion
  }

  // 当前编辑的题目信息
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

  // 题目操作：增删改
  const { copyQuestion, addQuestion, deleteQuestion, moveQuestion } = useQuestionData({
    questionDataList,
    updateTime,
    pageOperations,
    updateCounts: editGlobalBaseConf.updateCounts
  })

  return {
    editGlobalBaseConf,
    surveyId,
    sessionId,
    setSurveyId,
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
