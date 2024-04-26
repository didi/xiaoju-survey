<template>
  <form ref="ruleForm" :model="formModel" :rules="rules">
    <div v-for="(item) in renderData" :key="item.field">
      <questionWrapper
        ref="questionWrappers"
        class="gap"
        v-bind="$attrs"
        :moduleConfig="item"
        :qIndex="item.qIndex"
        :indexNumber="item.indexNumber"
        :showTitle="true"
        @change="handleChange"
      ></questionWrapper>
    </div>
    
  </form>
</template>
<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import questionWrapper from '../../materials/questions/widgets/QuestionRuleContainer'
import store from '@/render/store'
const props = defineProps({
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  },
  formModel: {
    type: Object,
    default: () => {
      return {}
    }
  },
  renderData: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['formChange', 'blur'])
// 这里不能直接使用change事件，否则父元素监听change的事件，会被绑定到里面的input上
// 导致接受到的data是个Event
const handleChange = (data) => {
  const { key }  = data
  debugger
  // 前置题改变通知目标题更新规则匹配
  store.state.ruleEngine.match(target, 'question', state.formValues)
  emit('formChange', data)
}
// 动态 field 管理
const fields = ref([])
const ruleForm = ref(null)
provide('Form', {
  model: computed(() => {
    return props.formModel
  }),
  rules: computed(() => {
    return props.rules
  })
})
// 题目组件ref
const questionWrappers = ref([])
onMounted(() => {
  const childInstances = questionWrappers.value
  childInstances.forEach((field) => {
    fields.value.push(field)
  })
})
const questionMatch = (field) => {
  return store.state.ruleEngine.match(field, 'question', props.formModel)
}

const validate = (callback) => {
  const length = fields.value.length
  if (length === 0) {
    callback(true)
  }

  let valid = true
  let count = 0
  let flag = false // 滚动到第一个未验证成功的元素

  fields.value.forEach((field) => {
    field.validate('', (errors) => {
      count++
      if (errors) {
        if (!flag) {
          flag = true
          try {
            const el = field.$el
            el.scrollIntoViewIfNeeded()
          } catch (e) {
            console.error(e)
          }
        }
        valid = false
      }
      if (typeof callback === 'function' && count === length) {
        callback(valid)
      }
    })
  })
}

defineExpose({
  validate
})
</script>