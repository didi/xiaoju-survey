<template>
  <div class="question-catalog-wrapper">
    <draggable :list="renderData" :options="dragOptions" @end="onDragEnd">
      <template v-for="(catalogItem, index) in renderData">
        <catalogItem
          :key="catalogItem.field"
          :title="catalogItem.title"
          :indexNumber="catalogItem.indexNumber"
          :showIndex="catalogItem.showIndex"
          @select="onSelect(index)"
        />
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import catalogItem from './catalogItem';
import { filterQuestionPreviewData } from '@/management/utils/index';

export default {
  name: 'QuestionCatalog',
  data() {
    return {
      dragOptions: {
        handle: '.draggHandle',
        ghostClass: 'catalog-item-ghost',
        dragClass: 'catalog-item-dragging',
      },
    };
  },
  computed: {
    questionDataList() {
      return this.$store.state.edit.schema.questionDataList;
    },
    renderData() {
      return filterQuestionPreviewData(this.questionDataList) || [];
    },
  },
  components: {
    draggable,
    catalogItem,
  },
  methods: {
    onDragEnd(data) {
      const { newIndex, oldIndex } = data;
      this.$store.dispatch('edit/moveQuestion', {
        index: oldIndex,
        range: newIndex - oldIndex,
      });
    },
    onSelect(index) {
      this.$store.commit('edit/setCurrentEditOne', index);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.question-catalog-wrapper {
  padding-bottom: 400px; // 考试题有个上拉框会盖住，改成和题型一致的
  .catelog-first-page {
    font-size: 12px;
    color: #999999;
    padding-bottom: 8px;
  }
  .catalog-item-ghost {
    &.question-catalog-item {
      .catalog-item {
        color: $normal-color-light;
        .draggHandle {
          color: $normal-color-light;
        }
      }
    }
  }
  .catalog-item-dragging {
    opacity: 1;
    background: #ffffff;
  }
}
</style>
