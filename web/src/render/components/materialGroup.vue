<template>
  <form ref="ruleForm" :model="formModel" :rules="rules">
    <questionWrapper
      ref="questionWrappers"
      v-for="(item) in renderData"
      :key="item.field"
      class="gap"
      v-bind="$attrs"
      :moduleConfig="item"
      :qIndex="item.qIndex"
      :indexNumber="item.indexNumber"
      :showTitle="true"
      @change="handleChange"
    ></questionWrapper>
  </form>
</template>
<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import questionWrapper from '../../materials/questions/widgets/QuestionRuleContainer'

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
