<template>
  <draggable
    v-model="renderData"
    handle=".question-wrapper.isSelected"
    filter=".question-wrapper.isSelected .question.isSelected"
    :group="DND_GROUP"
    :onEnd="checkEnd"
    :move="checkMove"
    itemKey="field"
  >
    <template #item="{ element, index }">
      <QuestionWrapper
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
      </QuestionWrapper>
    </template>
  </draggable>
</template>

<script>
import { computed, defineComponent, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import QuestionContainerB from '@/materials/questions/QuestionContainerB'
import QuestionWrapper from '@/management/pages/edit/components/QuestionWrapper.vue'
import draggable from 'vuedraggable'
import { filterQuestionPreviewData } from '@/management/utils/index'
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
  setup(props, { emit }) {
    const store = useStore()

    const renderData = computed({
      get() {
        return filterQuestionPreviewData(props.questionDataList)
      },
      set(questionDataList) {
        store.commit('edit/setQuestionDataList', questionDataList)
      }
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
      DND_GROUP,
      renderData,
      handleSelect,
      handleChangeSeq,
      checkMove,
      checkEnd,
      getQuestionRefByField
    }
  }
})
</script>
