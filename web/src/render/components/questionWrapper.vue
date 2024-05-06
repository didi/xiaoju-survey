<template>
  <questionRuleContainer
    v-if="visible"
    v-bind="$attrs"
    :moduleConfig="questionConfig"
    :indexNumber="indexNumber"
    :showTitle="true"
    @change="handleChange"
  ></questionRuleContainer> 
</template>
<script setup>
import { onMounted, onUnmounted, inject, ref, unref, computed } from 'vue'
import questionRuleContainer from '../../materials/questions/widgets/QuestionRuleContainer'
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
const questionConfig = computed(() =>{
  return {
    ...props.moduleConfig,
    value: store.state.formValues[props.moduleConfig.field]
  }
})
const visible = computed(() => {
  return store.state.ruleEngine.getResult(props.moduleConfig.field, 'question')
})


const Form = inject('Form',{
  type: Array,
  default: ''
})
const formModel = Form.model

onMounted(() => {
  console.log(props.moduleConfig.field, '出现了')
  // 题目显示通知目标题目从新匹配规则
  let fact = unref(formModel)
  fact[props.moduleConfig.field] = questionConfig.value.value
  notifyMatch(props.moduleConfig.field, fact)
  // match.value = store.state.ruleEngine.getResult(props.moduleConfig.field, 'question')
  // console.log({match})
  // if(!match) {
  //   return 
  // }
})
// 这里不能直接使用change事件，否则父元素监听change的事件，会被绑定到里面的input上
// 导致接受到的data是个Event
const handleChange = (data) => {
  emit('change', data)
  const { key, value }  = data
  let fact = unref(formModel)
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
  let fact = unref(formModel)
  fact[props.moduleConfig.field] = ''
  console.log(props.moduleConfig.field, '隐藏了')
  // 题目隐藏通知目标题目从新匹配规则
  notifyMatch(props.moduleConfig.field, fact)
})
</script>

