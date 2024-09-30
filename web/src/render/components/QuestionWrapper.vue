<template>
  <QuestionRuleContainer
    v-if="visibility"
    :moduleConfig="questionConfig"
    :indexNumber="indexNumber"
    :showTitle="true"
    @input="handleInput"
    @change="handleChange"
  ></QuestionRuleContainer>
</template>
<script setup>
import { unref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce, cloneDeep } from 'lodash-es'

import { NORMAL_CHOICES, RATES, QUESTION_TYPE } from '@/common/typeEnum.ts'
import QuestionRuleContainer from '@/materials/questions/QuestionRuleContainer'

import { useVoteMap } from '@/render/hooks/useVoteMap'
import { useOthersData } from '@/render/hooks/useOthersData'
import { useInputData } from '@/render/hooks/useInputData'

import { useQuestionStore } from '@/render/stores/question'
import { useSurveyStore } from '@/render/stores/survey'

import { setSurveyData, clearSurveyData, setSurveySubmit } from '@/render/utils/storage'

const props = defineProps({
  indexNumber: {
    type: [Number, String],
    default: 1
  },
  moduleConfig: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['change'])
const questionStore = useQuestionStore()
const surveyStore = useSurveyStore()

const formValues = computed(() => {
  return surveyStore.formValues
})
const { showLogicEngine, baseConf } = storeToRefs(surveyStore)
const { changeField, changeIndex, needHideFields } = storeToRefs(questionStore)

// 题型配置转换
const questionConfig = computed(() => {
  let moduleConfig = props.moduleConfig
  const { type, field, options = [], ...rest } = cloneDeep(moduleConfig)

  let allOptions = options

  if (type === QUESTION_TYPE.VOTE) {
    // 处理投票进度
    const { options, voteTotal } = useVoteMap(field)
    const voteOptions = unref(options)
    allOptions = allOptions.map((obj, index) => Object.assign(obj, voteOptions[index]))
    moduleConfig.voteTotal = unref(voteTotal)
  }
  if (NORMAL_CHOICES.includes(type) && options.some((option) => option.others)) {
    // 处理普通选择题的填写更多
    let { options, othersValue } = useOthersData(field)
    const othersOptions = unref(options)
    allOptions = allOptions.map((obj, index) => Object.assign(obj, othersOptions[index]))
    moduleConfig.othersValue = unref(othersValue)
  }

  if (
    RATES.includes(type) &&
    rest?.rangeConfig &&
    Object.keys(rest?.rangeConfig).filter((index) => rest?.rangeConfig[index].isShowInput).length >
      0
  ) {
    // 处理评分题的的选项后输入框
    let { rangeConfig, othersValue } = useInputData(field)
    moduleConfig.rangeConfig = unref(rangeConfig)
    moduleConfig.othersValue = unref(othersValue)
  }

  return {
    ...moduleConfig,
    options: allOptions,
    value: formValues.value[props.moduleConfig.field]
  }
})

const updateFormData = (value) => {
  const key = props.moduleConfig.field
  const formData = cloneDeep(formValues.value)
  formData[key] = value
  console.log(formData)
  return formData
}

const handleChange = (data) => {
  emit('change', data)
  // 处理投票题questionConfig
  if (props.moduleConfig.type === QUESTION_TYPE.VOTE) {
    questionStore.updateVoteData(data)
  }

  processJumpSkip()

  // 开启了断点续答：记录内容
  if (baseConf.value.fillAnswer) {
    const formData = updateFormData(data.value)
    storageAnswer(formData)
  }
}

const handleInput = debounce((e) => {
  // 开启了断点续答：记录内容
  if (baseConf.value.fillAnswer) {
    const formData = updateFormData(e.target.value)
    storageAnswer(formData)
  }
}, 500)

// 数据回填处理
const storageAnswer = (formData) => {
  const id = surveyStore.surveyPath

  clearSurveyData(id)
  setSurveyData(id, formData)
  setSurveySubmit(id, 0)
}

/** 问卷逻辑处理 */
// 显示逻辑：题目是否需要显示
const logicShow = computed(() => {
  // computed有计算缓存，当match有变化的时候触发重新计算
  const result = showLogicEngine.value.match(props.moduleConfig.field, 'question', formValues.value)
  return result === undefined ? true : result
})
// 跳转逻辑：题目是否需要跳过（隐藏）
const logicSkip = computed(() => {
  return needHideFields.value.includes(props.moduleConfig.field)
})
const visibility = computed(() => {
  return logicShow.value && !logicSkip.value
})

// 当题目被隐藏时，清空题目的选中项，实现a显示关联b，b显示关联c场景下，b隐藏不影响题目c的展示
watch(
  () => visibility.value,
  (newVal, oldVal) => {
    const { field, type, innerType } = props.moduleConfig
    if (!newVal && oldVal) {
      // 如果被隐藏题目有选中值，则需要清空选中值
      if (formValues.value[field].toString()) {
        let value = ''
        // 题型是多选，或者子题型是多选（innerType是用于投票）
        if (type === QUESTION_TYPE.CHECKBOX || innerType === QUESTION_TYPE.CHECKBOX) {
          value = value ? [value] : []
        }

        const data = {
          key: field,
          value: value
        }
        surveyStore.changeData(data)

        processJumpSkip()
      }
    }
  }
)

// 解析跳转逻辑
const processJumpSkip = () => {
  const targetResult = surveyStore.jumpLogicEngine
    .getResultsByField(changeField.value, surveyStore.formValues)
    .map((item) => {
      // 获取目标题的序号，处理跳转问卷末尾为最大题的序号
      const index =
        item.target === 'end'
          ? surveyStore.dataConf.dataList.length
          : questionStore.getQuestionIndexByField(item.target)
      return {
        index,
        ...item
      }
    })
  const notMatchedFields = targetResult.filter((item) => !item.result)
  const matchedFields = targetResult.filter((item) => item.result)
  // 目标题均未匹配，需要展示出来条件题和目标题之间的题目
  if (notMatchedFields.length) {
    notMatchedFields.forEach((element) => {
      const endIndex = element.index
      const fields = surveyStore.dataConf.dataList
        .slice(changeIndex.value + 1, endIndex)
        .map((item) => item.field)
      // hideMap中remove被跳过的题
      questionStore.removeNeedHideFields(fields)
    })
  }

  if (!matchedFields.length) return
  // 匹配到多个目标题时，取最大序号的题目
  const maxIndexQuestion = matchedFields
    .filter((item) => item.result)
    .sort((a, b) => b.index - a.index)[0].index

  // 条件题和目标题之间的题目隐藏
  const skipKey = surveyStore.dataConf.dataList
    .slice(changeIndex.value + 1, maxIndexQuestion)
    .map((item) => item.field)
  questionStore.addNeedHideFields(skipKey)
}
/** 问卷逻辑处理 */
</script>
