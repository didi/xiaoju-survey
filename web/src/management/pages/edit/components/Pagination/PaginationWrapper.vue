<template>
  <div class="pagination-wrap">
    <PaginationPanel
      v-model="schema.pageEditOne"
      :readonly="props.readonly"
      :totalPage="pageCount"
      @changePage="updatePage"
      :intervalCount="10"
    >
      <template #tooltip="{ index }">
        <div>
          <div v-if="index != 1" class="controls-wrap-item" @click="movePage(index, 'up')">
            前移一页
          </div>
          <div
            v-if="index != pageCount"
            class="mt8 controls-wrap-item"
            @click="movePage(index, 'down')"
          >
            后移一页
          </div>
          <div class="mt8 controls-wrap-item" @click="copyPage(index)">复制</div>
          <div class="mt8 controls-wrap-item" @click="deletePage(index)">删除</div>
        </div>
      </template>
    </PaginationPanel>
    <i-ep-plus
      v-if="!props.readonly"
      style="font-size: 12px"
      @click="addPageControls"
      class="plus-add"
    />
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { QUESTION_TYPE } from '@/common/typeEnum.ts'

import PaginationPanel from './PaginationPanel.vue'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  }
})

const editStore = useEditStore()
const { pageCount, schema, newQuestionIndex } = storeToRefs(editStore)

const {
  updatePageEditOne,
  addPage,
  createNewQuestion,
  addQuestion,
  setCurrentEditOne,
  deletePage,
  swapArrayRanges,
  copyPage
} = editStore

const updatePage = (index) => {
  setCurrentEditOne(null)
  updatePageEditOne(index)
}

const movePage = (position, type) => {
  setCurrentEditOne(null)
  const pageIndex = type === 'up' ? position - 1 : position + 1
  updatePageEditOne(pageIndex)
  if (type === 'up') {
    swapArrayRanges(position, position - 1)
  }
  if (type === 'down') {
    swapArrayRanges(position + 1, position)
  }
}

const addPageControls = () => {
  const newQuestion = createNewQuestion({ type: QUESTION_TYPE.TEXT })
  updatePageEditOne(pageCount.value + 1)
  setCurrentEditOne(null)
  addQuestion({ question: newQuestion, index: newQuestionIndex.value })
  setCurrentEditOne(newQuestionIndex.value)
  addPage()
}
</script>

<style lang="scss" scoped>
.mt8 {
  margin-top: 8px;
}

.controls-wrap {
  &-item {
    color: #4a4c5b;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;

    &:hover {
      color: $primary-color;
    }
  }
}

.pagination-wrap {
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 2px 10px -2px rgba(82, 82, 102, 0.2);
  border-radius: 4px;
  margin-bottom: 12px;

  .plus-add {
    cursor: pointer;
    margin-left: 12px;

    &:hover {
      color: $primary-color;
    }
  }
}
</style>
