<template>
  <div class="question-catalog-wrapper">
    <el-collapse>
      <el-collapse-item v-for="(v, i) in renderData" :key="v" :title="`第${i + 1}页`" :name="i + 1">
        <draggable
          v-model="renderData[i]"
          itemKey="field"
          :group="QUESTION_CATALOG"
          handle=".draggHandle"
          host-class="catalog-item-ghost"
        >
          <template #item="{ element }">
            <CatalogItem
              :title="element.title"
              :indexNumber="element.indexNumber"
              :showIndex="element.showIndex"
              @select="setPageOneEdit(element.qIndex, i + 1)"
            />
          </template>
        </draggable>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import draggable from 'vuedraggable'

import CatalogItem from './CatalogItem.vue'
import { QUESTION_CATALOG } from '@/management/config/dnd'

const editStore = useEditStore()
const { questionDataList, pageConf } = storeToRefs(editStore)
const { setCurrentEditOne, getPageQuestionData, updatePageEditOne, setPage, compareQuestionSeq } =
  editStore

const renderData: any = ref([])

const setPageOneEdit = (qIndex: number, pageIndex: number) => {
  updatePageEditOne(pageIndex)
  setCurrentEditOne(qIndex)
}

watch(
  () => [pageConf.value, questionDataList.value],
  () => {
    renderData.value = []
    for (let index = 0; index < pageConf.value.length; index++) {
      renderData.value.push(getPageQuestionData(index + 1))
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => renderData.value,
  (newVal) => {
    if (newVal.length == 0) return
    let pageData: Array<number> = []
    let questionList: Array<any> = []
    newVal.map((v: any) => {
      pageData.push(v.length)
      questionList.push(...v)
    })
    setPage(pageData)
    compareQuestionSeq(questionList)
  },
  {
    deep: true
  }
)
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

  :deep(.el-collapse-item__header) {
    font-size: 14px;
    color: #6e707c;
    font-weight: 500;
  }

  .catalog-item-dragging {
    opacity: 1;
    background: #ffffff;
  }
}
</style>
