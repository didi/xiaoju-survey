<template>
  <draggable
    :list="renderData"
    :options="dragOptions"
    :onEnd="checkEnd"
    :move="checkMove"
    itemKey='field'>
    <template #item>
      <questionWrapper
        v-for="item in renderData" v-bind="$attrs"
        :ref="`questionWrapper-${element.field}`"
        :moduleConfig="element"
        :qIndex="element.qIndex"
        :indexNumber="element.indexNumber"
        :isSelected="currentEditOne === index"
        :isLast="index + 1 === questionDataList.length"
        @select="handleSelect"
        @changeSeq="handleChangeSeq"
      >
        <QuestionContainer
          :type="item.type"
          :moduleConfig="item"
          :indexNumber="item.indexNumber"
          :isSelected="currentEditOne === index"
          :readonly="true"
          v-bind="$listeners"
          @select="handleSelect"
        >
        </QuestionContainer>
      </questionWrapper>
    </template>
  </draggable>
</template>
<script>
import { computed, defineComponent, ref, getCurrentInstance } from 'vue';
import QuestionContainer from '@/materials/questions/widgets/QuestionContainer.jsx';
import questionWrapper from './questionWrapper.vue';
import draggable from 'vuedraggable';
import { filterQuestionPreviewData } from '@/management/utils/index';

export default defineComponent({
  name: '',
  components: { draggable },
  props: {
    currentEditOne: {
      type: [Number, String],
      default: null,
    },
    questionDataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {},
  setup(props, { emit }) {
    const renderData = computed(() => {
      return filterQuestionPreviewData(props.questionDataList);
    });
    const handleSelect = (index) => {
      emit('select', index);
    };
    const handleChangeSeq = (data) => {
      emit('changeSeq', data);
    };

    const isMoving = ref(false);

    const checkMove = () => {
      isMoving.value = true;
    };

    const checkEnd = ({ oldIndex, newIndex }) => {
      emit('changeSeq', {
        type: 'move',
        index: oldIndex,
        range: newIndex - oldIndex,
      });
    };

    const instance = getCurrentInstance();

    const getQuestionRefByField = (field) => {
      return instance?.proxy?.$refs[`questionWrapper-${field}`] || null;
    };

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
        forceFallback: true,
      },
      getQuestionRefByField,
    };
  }
});
</script>
