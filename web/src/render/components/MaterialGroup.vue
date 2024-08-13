<template>
  <form ref="ruleForm" :model="formValues" :rules="rules">
    <div v-for="item in renderData" :key="item.field">
      <QuestionWrapper
        class="gap"
        :moduleConfig="item"
        :indexNumber="item.indexNumber"
        @change="handleChange"
      ></QuestionWrapper>
    </div>
  </form>
</template>
<script setup>
import { inject, provide, computed, onBeforeMount } from 'vue'
import QuestionWrapper from './QuestionWrapper.vue'
// import { flatten } from 'lodash-es'

const $bus = inject('$bus')
const props = defineProps({
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  },
  formValues: {
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
const fields = []
provide('Form', {
  model: computed(() => {
    return props.formValues
  }),
  rules: computed(() => {
    return props.rules
  })
})

// 记录当前视图中渲染的元素，用于提交时全局表单校验
onBeforeMount(() => {
  $bus.on('form.addField', (field) => {
    if (field) {
      fields.push(field)
    }
  })

  $bus.on('form.removeField', (field) => {
    if (field) {
      fields.splice(fields.indexOf(field), 1)
    }
  })
})

const validate = (callback) => {
  const length = fields.length
  if (length === 0) {
    callback(true)
  }

  let valid = true
  let count = 0
  let flag = false // 滚动到第一个未验证成功的元素

  // 表单校验
  fields.forEach((field) => {
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
