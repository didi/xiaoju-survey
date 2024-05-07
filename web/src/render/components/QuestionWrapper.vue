<template>
  <QuestionRuleContainer
    v-if="visible"
    v-bind="$attrs"
    :moduleConfig="questionConfig"
    :indexNumber="indexNumber"
    :showTitle="true"
    @change="handleChange"
  ></QuestionRuleContainer> 
</template>
<script setup>
import { onMounted, onUnmounted, unref, computed } from 'vue'
import QuestionRuleContainer from '../../materials/questions/widgets/QuestionRuleContainer'
import { useVoteMap } from '@/render/hooks/useVoteMap'
import { useOthersValue } from '@/render/hooks/useOthersValue'
import { useShowInput } from '@/render/hooks/useShowInput'
import store from '@/render/store'
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  indexNumber: {
    type: Number,
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

const formValues = computed(() => {
  return store.state.formValues
})
const questionConfig = computed(() =>{
  // 这里依赖的formValue，所以change时会触发重新计算
  let moduleConfig = props.moduleConfig
  const { type, field, options, ...rest } = cloneDeep(moduleConfig)
  let alloptions = options
  if(type === 'vote') {
    const { options, voteTotal } = useVoteMap(field)
    const voteOptions = unref(options)
    alloptions = alloptions.map((obj, index) => Object.assign(obj, voteOptions[index]))
    moduleConfig.voteTotal = unref(voteTotal)
  }
  if(['radio','checkbox'].includes(props.moduleConfig.type)) {
    let { options, othersValue } = useOthersValue(field)
    const othersOptions = unref(options)
    alloptions = alloptions.map((obj, index) => Object.assign(obj, othersOptions[index]))
    moduleConfig.othersValue = unref(othersValue)
  }
  if(['radio-star','radio-nps'].includes(props.moduleConfig.type)) {
    let { rangeConfig, othersValue } = useShowInput(field)
    console.log({rangeConfig, othersValue})
    moduleConfig.rangeConfig = unref(rangeConfig)
    moduleConfig.othersValue = unref(othersValue)
  }
  
  return {
    ...moduleConfig,
    options: alloptions,
    value: formValues.value[props.moduleConfig.field]
  }
})
const visible = computed(() => {
  // 显示逻辑-处理视图
  return store.state.ruleEngine.getResult(props.moduleConfig.field, 'question')
})


onMounted(() => {
  console.log(props.moduleConfig.field, '出现了')
  // 题目显示通知目标题目从新匹配规则
  let fact = unref(formValues)
  fact[props.moduleConfig.field] = questionConfig.value.value
  notifyMatch(props.moduleConfig.field, fact)
})
// 这里不能直接使用change事件，否则父元素监听change的事件，会被绑定到里面的input上
// 导致接受到的data是个Event
const handleChange = (data) => {
  const { key, value }  = data
  // 处理投票题
  if(props.moduleConfig.type === 'vote') {
    store.dispatch('updateVoteData', data)
  }
  // 处理选择填写更多
  // if(['radio','checkbox'].includes(props.moduleConfig.type)) {
  //   useOthersValue(props.moduleConfig.field)
  // }

  // 处理评分题填写更多
  
  // 处理显示逻辑
  let fact = unref(formValues)
  fact[key] = value
  notifyMatch(key, fact)

  emit('change', data)
}
const notifyMatch = (key, fact) => {
  const targets = store.state.ruleEngine.findTargetsByField(key) || []
  // 前置题改变通知目标题更新规则匹配
  targets.forEach((target) => {
    store.state.ruleEngine.match(target, 'question', fact)
  })
}
onUnmounted(() => {
  let fact = unref(formValues)
  fact[props.moduleConfig.field] = ''
  console.log(props.moduleConfig.field, '隐藏了')
  // 题目隐藏通知目标题目从新匹配规则
  notifyMatch(props.moduleConfig.field, fact)
})
</script>

