<template>
  <div class="pagination-wrap">
    <PaginationPanel v-model="pagingEditOne" :totalPage="pagingCount" @changePage="updatePageEditOne" :intervalCount="10">
      <template #tooltip="{index}">
        <div>
          <div v-if="index != 1" class="controls-wrap-item" @click="movePaging(index, 'up')">前移一页</div>
          <div v-if="index != pagingCount" class="mt8 controls-wrap-item" @click="movePaging(index, 'down')">后移一页</div>
          <div class="mt8 controls-wrap-item" @click="copyPaging(index)">复制</div>
          <div class="mt8 controls-wrap-item" @click="deletePaging(index)">删除</div>
        </div>
      </template>
    </PaginationPanel>
    <i-ep-plus style="font-size: 12px;" @click="addPagingControls" class="plus-add" />
  </div>
</template>
<script setup>
import PaginationPanel from '../modules/pagingModule/PaginationPanel.vue'
import { useEditStore } from '@/management/stores/edit'
import { storeToRefs } from 'pinia'
import { QUESTION_TYPE } from '@/common/typeEnum.ts'

const editStore = useEditStore();
const { pagingCount, pagingEditOne, newQuestionIndex } = storeToRefs(editStore)

const { updatePagingEditOne, addPaging, createNewQuestion, addQuestion, setCurrentEditOne, deletePaging, swapArrayRanges, copyPaging } = editStore;



const updatePageEditOne = (index) => {
  setCurrentEditOne(null)
  updatePagingEditOne(index);
}

const movePaging = (position, type) => {
  setCurrentEditOne(null)
  const pagingIndex = type === 'up' ? position - 1 : position + 1;
  updatePagingEditOne(pagingIndex)
  if (type === 'up') {
    swapArrayRanges(position, position - 1)
  }
  if (type === 'down') {
    swapArrayRanges(position + 1, position)
  }
}


const addPagingControls = () => {
  const newQuestion = createNewQuestion({ type: QUESTION_TYPE.TEXT })
  updatePagingEditOne(pagingCount.value + 1)
  setCurrentEditOne(null)
  addQuestion({ question: newQuestion, index: newQuestionIndex.value })
  setCurrentEditOne(newQuestionIndex.value)
  addPaging()
}


</script>

<style lang="scss">
.mt8 {
  margin-top: 8px
}

.controls-wrap {
  &-item {
    color: #4A4C5B;
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
  background: #FFFFFF;
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
