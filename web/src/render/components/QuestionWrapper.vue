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
  let moduleConfig = props.moduleConfig
  const { type, field, options, ...rest } = cloneDeep(moduleConfig)
  console.log(field,'这里依赖的formValue，所以change时会触发重新计算')
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
  const { field, type, innerType } = props.moduleConfig
  const matchResult = store.state.ruleEngine.getResult(field, 'question')
  console.log(field + '重新计算visible：'+ matchResult)
  if(!matchResult) {
    let value = ''
    // 题型是多选，或者子题型是多选（innerType是用于投票）
    if (/checkbox/.test(type) || innerType === 'checkbox') {
      value = value ? [value] : []
    }
    const data = {
      key: field,
      value: value
    }
    store.commit('changeFormData', data)
    notifyMatch(field)
  }
  // 显示逻辑-处理视图
  return matchResult
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
  emit('change', data)
  // 处理显示逻辑
  notifyMatch(key)
}
const notifyMatch = (key) => {
  let fact = unref(formValues)
  const targets = store.state.ruleEngine.findTargetsByField(key) || []
  // 前置题改变通知目标题更新规则匹配
  targets.forEach((target) => {
    store.state.ruleEngine.match(target, 'question', fact)
  })
}
</script>

