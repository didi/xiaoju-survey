<template>
  <div :class="['question', props.isSelected ? 'isSelected' : '']">
    <moduleTitle :indexNumber="props.indexNumber" :title="props.moduleConfig.title"
      :showType="true" :type="props.type" v-if="showTitle" />
    <div class="question-block">
      <blockComponent readonly v-bind="props" 
        :options="props.moduleConfig.options"
        :field="props.moduleConfig.field"
        :value="props.moduleConfig.value"
        @blur="onBlur" @focus="onFocus" @change="onChange">
      </blockComponent>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, shallowRef } from 'vue'
import moduleTitle from '@/materials/questions/widgets/Title.jsx'
import moduleList from '@/materials/questions/common/config/moduleList.js'
import '@/materials/questions/common/css/question.scss'

import questionLoader from '@/materials/questions/questionLoader.js'
import '@/materials/questions/common/css/title.scss'

const getBlockComponent = async (type) => {
  const path = moduleList[type]
  const component = await questionLoader.loadComponent(type, path)

  return component
}

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  indexNumber: {
    type: [Number, String],
    default: 1
  },
  moduleConfig: {
    type: Object,
    default: () => {
      return {
        field: 'quiestion01',
        type: 'text',
        component: 'InputModule',
        title: '标题1单行输入框',
        value: '123444',
        showType: 'text',
        placeholder: '请填写',
        textRange: {
          max: {
            placeholder: '500',
            value: 500
          },
          min: {
            placeholder: '0',
            value: 0
          }
        },
        valid: 'n'
      }
    }
  },
  readonly: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['blur', 'focus', 'change', 'select'])

const blockComponent = shallowRef(null)

getBlockComponent(props.type).then(({ component }) => {
  blockComponent.value = component
})



const onBlur = () => {
  emit('blur')
}
const onFocus = () => {
  emit('focus')
}
const onChange = (data) => {
  emit('change', data)
}
const onClick = () => {
  emit('select', props.indexNumber)
}

</script>
