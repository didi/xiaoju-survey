<template>
  <QuestionRuleContainer
    v-if="visibily"
    :moduleConfig="questionConfig"
    :indexNumber="indexNumber"
    :showTitle="true"
    @change="handleChange"
  ></QuestionRuleContainer>
</template>
<script setup>
import { unref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import QuestionRuleContainer from '../../materials/questions/QuestionRuleContainer'
import { useVoteMap } from '@/render/hooks/useVoteMap'
import { useShowOthers } from '@/render/hooks/useShowOthers'
import { useShowInput } from '@/render/hooks/useShowInput'
import { cloneDeep } from 'lodash-es'
import { useQuestionStore } from '../stores/question'
import { useSurveyStore } from '../stores/survey'

import { NORMAL_CHOICES, RATES, QUESTION_TYPE } from '@/common/typeEnum.ts'

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
  },
})
const emit = defineEmits(['change'])
const questionStore = useQuestionStore()
const surveyStore = useSurveyStore()

const formValues = computed(() => {
  return surveyStore.formValues
})
const { showLogicEngine } = storeToRefs(surveyStore)
const {
  changeField,
  changeIndex,
  needHideFields,
} = storeToRefs(questionStore)
// 题型配置转换
const questionConfig = computed(() => {
  let moduleConfig = props.moduleConfig
  const { type, field, options = [], ...rest } = cloneDeep(moduleConfig)
  // console.log(field,'这里依赖的formValue，所以change时会触发重新计算')
  let alloptions = options

  if (type === QUESTION_TYPE.VOTE) {
    const { options, voteTotal } = useVoteMap(field)
    const voteOptions = unref(options)
    alloptions = alloptions.map((obj, index) => Object.assign(obj, voteOptions[index]))
    moduleConfig.voteTotal = unref(voteTotal)
  }

  if (
    NORMAL_CHOICES.includes(type) &&
    options.filter((optionItem) => optionItem.others).length > 0
  ) {
    let { options, othersValue } = useShowOthers(field)
    const othersOptions = unref(options)
    alloptions = alloptions.map((obj, index) => Object.assign(obj, othersOptions[index]))
    moduleConfig.othersValue = unref(othersValue)
  }

  if (
    RATES.includes(type) &&
    rest?.rangeConfig &&
    Object.keys(rest?.rangeConfig).filter((index) => rest?.rangeConfig[index].isShowInput).length >
      0
  ) {
    let { rangeConfig, othersValue } = useShowInput(field)
    moduleConfig.rangeConfig = unref(rangeConfig)
    moduleConfig.othersValue = unref(othersValue)
  }

  return {
    ...moduleConfig,
    options: alloptions,
    value: formValues.value[props.moduleConfig.field]
  }
})

const logicshow = computed(() => {
  // computed有计算缓存，当match有变化的时候触发重新计算
  const result = showLogicEngine.value.match(props.moduleConfig.field, 'question', formValues.value)
  return result === undefined ? true : result
})


const logicskip = computed(() => {
  return needHideFields.value.includes(props.moduleConfig.field)
})
const visibily = computed(() => {
  return logicshow.value && !logicskip.value
})


// 当题目被隐藏时，清空题目的选中项，实现a显示关联b，b显示关联c场景下，b隐藏不影响题目c的展示
watch(
  () => visibily.value,
  (newVal, oldVal) => {
    const { field, type, innerType } = props.moduleConfig
    if (!newVal && oldVal) {
      // 如果被隐藏题目有选中值，则需要清空选中值
      if(formValues.value[field].toString()) {
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

const handleChange = (data) => {
  emit('change', data)
  // 处理投票题
  if (props.moduleConfig.type === QUESTION_TYPE.VOTE) {
    questionStore.updateVoteData(data)
  }
  processJumpSkip()
}

const processJumpSkip = () => {
    const targetResult = surveyStore.jumpLogicEngine
      .getResultsByField(changeField.value, surveyStore.formValues)
      .map(item => {
        // 获取目标题的序号，处理跳转问卷末尾为最大题的序号
        const index = item.target === 'end' ? surveyStore.dataConf.dataList.length : questionStore.getQuestionIndexByField(item.target)
        return {
          index,
          ...item
        }
      })
    const notMatchedFields = targetResult.filter(item => !item.result)
    const matchedFields = targetResult.filter(item => item.result)
    // 目标题均未匹配，需要展示出来条件题和目标题之间的题目
    if (notMatchedFields.length) {
      notMatchedFields.forEach(element => {
        const endIndex = element.index
        const fields = surveyStore.dataConf.dataList.slice(changeIndex.value + 1, endIndex).map(item => item.field)
        // hideMap中remove被跳过的题
        questionStore.removeNeedHideFields(fields)
      });
    }
  
    if (!matchedFields.length) return
    // 匹配到多个目标题时，取最大序号的题目
    const maxIndexQuestion =
      matchedFields.filter(item => item.result).sort((a, b) => b.index - a.index)[0].index
  
    // 条件题和目标题之间的题目隐藏
    const skipKey = surveyStore.dataConf.dataList
      .slice(changeIndex.value + 1, maxIndexQuestion).map(item => item.field)
    questionStore.addNeedHideFields(skipKey)
  }

</script>
