<template>
  <draggable
    :list="renderData"
    :options="dragOptions"
    :onEnd="checkEnd"
    :move="checkMove"
    itemKey="field"
  >
    <template #item="{ element, index }">
      <questionWrapper
        v-bind="$attrs"
        :ref="`questionWrapper-${element.field}`"
        :moduleConfig="element"
        :qIndex="element.qIndex"
        :indexNumber="element.indexNumber"
        :isSelected="currentEditOne === index"
        :isLast="index + 1 === questionDataList.length"
        @select="handleSelect"
      >
        <QuestionContainerB
          v-bind="$attrs"
          :type="element.type"
          :moduleConfig="element"
          :indexNumber="element.indexNumber"
          :isSelected="currentEditOne === index"
          :readonly="true"
          @select="handleSelect"
        ></QuestionContainerB>
      </questionWrapper>
    </template>
  </draggable>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance } from 'vue'
import QuestionContainerB from '@/materials/questions/widgets/QuestionContainerB.jsx'
import questionWrapper from './questionWrapper.vue'
import draggable from 'vuedraggable'
import { filterQuestionPreviewData } from '@/management/utils/index'

export default defineComponent({
  components: {
    draggable,
    questionWrapper,
    QuestionContainerB
  },
  props: {
    currentEditOne: {
      type: [Number, String],
      default: null
    },
    questionDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const renderData = computed(() => {
      return filterQuestionPreviewData(props.questionDataList)
    })
    const handleSelect = (index) => {
      emit('select', index)
    }
    const handleChangeSeq = (data) => {
      emit('changeSeq', data)
    }

    const isMoving = ref(false)

    const checkMove = () => {
      isMoving.value = true
    }

    const checkEnd = ({ oldIndex, newIndex }) => {
      emit('changeSeq', {
        type: 'move',
        index: oldIndex,
        range: newIndex - oldIndex
      })
    }

    const instance = getCurrentInstance()

    const getQuestionRefByField = (field) => {
      return instance?.proxy?.$refs[`questionWrapper-${field}`] || null
    }

    return {
      renderData,
      handleSelect,
      handleChangeSeq,
      checkMove,
      checkEnd,
      dragOptions: {
        animation: 0,
        group: 'previewList',
        handle: '.el-icon-rank',
        scroll: true,
        scrollSpeed: 2500,
        scrollSensitivity: 150,
        forceFallback: true
      },
      getQuestionRefByField
    }
  }
})
</script>
