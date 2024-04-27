<template>
  <questionRuleContainer
    v-bind="$attrs"
    :moduleConfig="moduleConfig"
    :indexNumber="indexNumber"
    :showTitle="true"
    @change="handleChange"
  ></questionRuleContainer> 
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
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
onMounted(() => {
  console.log(props.moduleConfig.field, '出现了')
  // 题目显示通知目标题目从新匹配规则
  let fact = {}
  fact[props.moduleConfig.field] = props.moduleConfig.value
  notifyMatch(props.moduleConfig.field, fact)
})
// 这里不能直接使用change事件，否则父元素监听change的事件，会被绑定到里面的input上
// 导致接受到的data是个Event
const handleChange = (data) => {
  emit('change', data)
  const { key, value }  = data
  let fact = {}
  fact[key] = value
  notifyMatch(key, fact)
}
const notifyMatch = (key, fact) => {
  const targets = store.state.ruleEngine.findTargets(key)
  // 前置题改变通知目标题更新规则匹配
  targets.forEach((target) => {
    store.state.ruleEngine.match(target, 'question', fact)
  })
}
onUnmounted(() => {
  console.log(props.moduleConfig.field, '隐藏了')
  // 题目隐藏通知目标题目从新匹配规则
  notifyMatch(props.moduleConfig.field, {})
})
</script>

