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
import store from '@/render/store'
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
  let moduleConfig = props.moduleConfig
  const { type, field, options, ...rest } = moduleConfig
  if(type === 'vote') {
    const { options, voteTotal } = useVoteMap(field)
    moduleConfig.options = unref(options)
    moduleConfig.voteTotal = unref(voteTotal)
  }
  return {
    ...moduleConfig,
    value: formValues.value[props.moduleConfig.field]
  }
})
const visible = computed(() => {
  // 显示逻辑-处理视图
  console.log(props.moduleConfig.field, store.state.ruleEngine.getResult(props.moduleConfig.field, 'question'))
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
  if(props.moduleConfig.type === 'vote') {
    store.dispatch('updateVoteData', data)
  }
  
  emit('change', data)
  const { key, value }  = data
  let fact = unref(formValues)
  fact[key] = value
  notifyMatch(key, fact)
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

