<template>
  <div class="question-catalog-wrapper">
    <draggable
      :list="renderData"
      @end="handleDragEnd"
      itemKey="field"
      handle=".draggHandle"
      host-class="catalog-item-ghost"
    >
      <template #item="{ element, index }">
        <CatalogItem
          :title="element.title"
          :indexNumber="element.indexNumber"
          :showIndex="element.showIndex"
          @select="setCurrentEditOne(index)"
        />
      </template>
    </draggable>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import draggable from 'vuedraggable'

import CatalogItem from './CatalogItem.vue'
import { filterQuestionPreviewData } from '@/management/utils/index'

const editStore = useEditStore()
const { questionDataList, currentEditOne } = storeToRefs(editStore)
const { moveQuestion, setCurrentEditOne } = editStore
const renderData = computed(() => {
  return filterQuestionPreviewData(questionDataList.value) || []
})

const handleDragEnd = ({ newIndex, oldIndex }: any) => {
  if (currentEditOne.value === oldIndex) {
    setCurrentEditOne(newIndex)
  }

  moveQuestion({
    index: oldIndex,
    range: newIndex - oldIndex
  })
}
</script>
<style lang="scss" scoped>
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
