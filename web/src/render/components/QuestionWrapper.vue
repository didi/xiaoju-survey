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
import { unref, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import QuestionRuleContainer from '../../materials/questions/QuestionRuleContainer'
import { useVoteMap } from '@/render/hooks/useVoteMap'
import { useShowOthers } from '@/render/hooks/useShowOthers'
import { useShowInput } from '@/render/hooks/useShowInput'
import { cloneDeep } from 'lodash-es'
import { useQuestionStore } from '../stores/question'
import { useSurveyStore } from '../stores/survey'

import { NORMAL_CHOICES, RATES, QUESTION_TYPE } from '@/common/typeEnum.ts'
import { getQuestionIndexByField, findMinKeyInMap } from '@/render/utils/index.js'

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
const { dataConf, changeField, showLogicEngine, jumpLogicEngine } = storeToRefs(surveyStore)
const questionConfig = computed(() => {
  let moduleConfig = props.moduleConfig
  const { type, field, options = [], ...rest } = cloneDeep(moduleConfig)
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

const showMatch = computed(() => {
  // computed有计算缓存，当match有变化的时候触发重新计算
  const result = showLogicEngine.value.match(props.moduleConfig.field, 'question', formValues.value)
  return result === undefined ? true : result
})

watch(
  () => showMatch.value,
  (newVal, oldVal) => {
    // 题目从显示到隐藏，需要清空值
    const { field, type, innerType } = props.moduleConfig
    if (!newVal && oldVal) {
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
    }
  }
)

const jumpSkip = ref(false)
const visibily = computed(() => {
  return showMatch.value && !jumpSkip.value
})

// 监听formValues变化，判断当前题目是否需要跳过
watch(
  () => formValues,
  (newVal) => {
    const currentIndex = getQuestionIndexByField(dataConf.value.dataList, questionConfig.value.field)
    const changeIndex = getQuestionIndexByField(dataConf.value.dataList, changeField.value)
    // 前面的题目不受跳题影响
    if (currentIndex < changeIndex) {
      return
    }
    // 找到当前题关联的目标题规则
    const rules = jumpLogicEngine.value.findRulesByField(changeField.value)
    // change没有跳题关联的题直接返回
    if (!rules.length) {
      return
    }
    // 计算目标题的命中情况
    const targetsResult = new Map()
    // 处理只有一条规则的情况
    if (rules.length === 1) {
      rules.forEach(([, rule]) => {
        const index = getQuestionIndexByField(dataConf.value.dataList, rule.target)
        targetsResult.set(
          index,
          jumpLogicEngine.value.match(rule.target, 'question', newVal.value, 'or')
        )
      })
    } else {
      // 如果存在多条规则，能命中选项跳转则精确命中选项跳转,否则命中答题跳转
      const optionJump = rules.filter(([, rule]) => {
        // 过滤掉答题跳转，剩下的就是选项跳转
        const conditionhash = `${changeField.value}neq`
        return !rule.conditions.get(conditionhash)
      })
      if (optionJump.length) {
        optionJump.forEach(([, rule]) => {
          const index = getQuestionIndexByField(dataConf.value.dataList, rule.target)
          targetsResult.set(
            index,
            jumpLogicEngine.value.match(rule.target, 'question', newVal.value, 'or')
          )
        })
      } else {
        const answerJump = rules.find(([, rule]) => {
          const conditionhash = `${changeField.value}neq`
          return rule.conditions.get(conditionhash)
        })
        const index = getQuestionIndexByField(dataConf.value.dataList, answerJump[1].target)
        targetsResult.set(
          index,
          jumpLogicEngine.value.match(answerJump[1].target, 'question', newVal.value, 'or')
        )
      }
    }

    const jumpFitMinIndex = findMinKeyInMap(targetsResult, true)

    const jumpQuestion = currentIndex < jumpFitMinIndex
    const jumpEnd = jumpFitMinIndex === -1 && rules.map(([, rule]) => rule.target).includes('end')

    if (changeIndex < currentIndex && (jumpQuestion || jumpEnd)) {
      jumpSkip.value = true
    } else {
      jumpSkip.value = false
    }
  },
  { deep: true }
)

const handleChange = (data) => {
  emit('change', data)
  // 处理投票题
  if (props.moduleConfig.type === QUESTION_TYPE.VOTE) {
    questionStore.updateVoteData(data)
  }
}
</script>
