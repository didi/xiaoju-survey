<template>
  <div :class="['question', isSelected ? 'isSelected' : '']">
    <moduleTitle v-bind="props" v-if="showTitle" />
    <div class="question-block">
      <blockComponent readonly v-bind="props" @blur="onBlur" @focus="onFocus" @change="onChange"></blockComponent>
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

const props = defineProps(['type', 'moduleConfig', 'value'])

const blockComponent = shallowRef(null)

console.log('props.type', props.type)
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
