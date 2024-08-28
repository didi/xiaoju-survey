<template>
  <draggable
    v-model="renderData"
    handle=".question-wrapper.is-move"
    filter=".question-wrapper.is-move .question.isSelected"
    :preventOnFilter="false"
    :group="DND_GROUP"
    :onEnd="checkEnd"
    :move="checkMove"
    itemKey="field"
  >
    <template #item="{ element, index }">
      <QuestionWrapper
        :ref="`questionWrapper-${element.field}`"
        :moduleConfig="element"
        :qIndex="element.qIndex"
        :isFirst="index == 0"
        :indexNumber="element.indexNumber"
        :isSelected="currentEditOne === element.qIndex"
        :isLast="index + 1 === questionDataList.length"
        @select="handleSelect"
        @changeSeq="handleChangeSeq"
      >
        <QuestionContainerB
          :type="element.type"
          :moduleConfig="element"
          :indexNumber="element.indexNumber"
          :isSelected="currentEditOne === element.qIndex"
          :readonly="true"
          @change="handleChange"
        >
          <template #advancedEdit>
            <slot name="advancedEdit" :moduleConfig="element"></slot>
          </template>
        </QuestionContainerB>
      </QuestionWrapper>
    </template>
  </draggable>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import QuestionContainerB from '@/materials/questions/QuestionContainerB'
import QuestionWrapper from '@/management/pages/edit/components/QuestionWrapper.vue'
import draggable from 'vuedraggable'
import { DND_GROUP } from '@/management/config/dnd'

export default defineComponent({
  components: {
    draggable,
    QuestionWrapper,
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
  emits: ['change', 'select', 'changeSeq', 'change'],
  setup(props, { emit }) {
    const editStore = useEditStore()
    const renderData = computed({
      get() {
        return props.questionDataList //filterQuestionPreviewData(props.questionDataList)
      },
      set(value) {
        editStore.moveQuestionDataList(value)
      }
    })
    const handleSelect = (index) => {
      emit('select', index)
    }
    const handleChange = (data) => {
      emit('change', data)
    }
    const handleChangeSeq = (data) => {
      emit('changeSeq', data)
    }

    const isMoving = ref(false)

    const checkMove = () => {
      isMoving.value = true
    }

    const checkEnd = ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        emit('changeSeq', {
          type: 'move',
          index: newIndex,
          range: 0
        })

        if (props.currentEditOne === oldIndex) {
          emit('select', newIndex)
        }
      }
    }

    const instance = getCurrentInstance()

    const getQuestionRefByField = (field) => {
      return instance?.proxy?.$refs[`questionWrapper-${field}`] || null
    }

    return {
      DND_GROUP,
      renderData,
      handleSelect,
      handleChange,
      handleChangeSeq,
      checkMove,
      checkEnd,
      getQuestionRefByField
    }
  }
})
</script>
