<template>
  <div class="main-operation" @click="onMainClick" ref="mainOperation">
    <div class="pagination-wrapper">
      <PageWrapper :readonly="false" />
    </div>
    <div class="operation-wrapper" ref="operationWrapper">
      <div class="box content" ref="box">
        <MainTitle
          v-if="pageEditOne == 1"
          :bannerConf="bannerConf"
          :readonly="false"
          :is-selected="currentEditOne === 'mainTitle'"
          @select="setCurrentEditOne('mainTitle')"
          @change="handleChange"
        />
        <MaterialGroup
          :current-edit-one="parseInt(currentEditOne)"
          :questionDataList="pageQuestionData"
          @select="setCurrentEditOne"
          @change="handleChange"
          @changeSeq="onQuestionOperation"
          ref="materialGroup"
        >
          <template #advancedEdit="{ moduleConfig }">
            <AdvancedComponent :moduleConfig="moduleConfig" @handleChange="handleChange" />
          </template>
        </MaterialGroup>
        <SubmitButton
          :submit-conf="submitConf"
          :readonly="false"
          :skin-conf="skinConf"
          :is-finally-page="isFinallyPage"
          :is-selected="currentEditOne === 'submit'"
          @select="setCurrentEditOne('submit')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import { storeToRefs } from 'pinia'

import communalLoader from '@materials/communals/communalLoader.js'

import PageWrapper from '@/management/pages/edit/components/Pagination/PaginationWrapper.vue'
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'
import AdvancedComponent from './components/AdvancedConfig/index.vue'

import { useEditStore } from '@/management/stores/edit'

const MainTitle = communalLoader.loadComponent('MainTitle')
const SubmitButton = communalLoader.loadComponent('SubmitButton')

const editStore = useEditStore()
const { currentEditOne, currentEditKey, pageQuestionData, isFinallyPage, pageEditOne } =
  storeToRefs(editStore)
const { schema, changeSchema, moveQuestion, copyQuestion, deleteQuestion, setCurrentEditOne } =
  editStore
const mainOperation = ref(null)
const materialGroup = ref(null)

const { bannerConf, submitConf, skinConf } = toRefs(schema)

// const autoScrollData = computed(() => {
//   return {
//     currentEditOne: currentEditOne.value,
//     len: questionDataList.value.length
//   }
// })

const handleChange = (data) => {
  if (currentEditOne.value === null) {
    return
  }
  const { key, value } = data
  const resultKey = `${currentEditKey.value}.${key}`
  changeSchema({ key: resultKey, value })
}

const onMainClick = (e) => {
  if (e.target === mainOperation.value) {
    setCurrentEditOne(null)
  }
}

const onQuestionOperation = (data) => {
  switch (data.type) {
    case 'move':
      moveQuestion({
        index: data.index,
        range: data.range
      })
      break
    case 'delete':
      deleteQuestion({ index: data.index })
      break
    case 'copy':
      copyQuestion({ index: data.index })
      break
    default:
      break
  }
}

watch(
  skinConf,
  (newVal) => {
    const { themeConf, backgroundConf, contentConf } = newVal
    const root = document.documentElement
    if (themeConf?.color) {
      root.style.setProperty('--primary-color', themeConf?.color) // 设置主题颜色
    }
    if (backgroundConf?.color) {
      root.style.setProperty('--primary-background-color', backgroundConf?.color) // 设置背景颜色
    }
    if (contentConf?.opacity) {
      root.style.setProperty('--opacity', contentConf?.opacity / 100) // 设置全局透明度
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 实际编辑题目不会只是从上到下而需要上下题目对比。
// 一直跳动到顶部影响编辑操作，若有场景需要可自行放开
// watch(autoScrollData, (newVal) => {
//   const { currentEditOne } = newVal
//   if (typeof currentEditOne === 'number') {
//     setTimeout(() => {
//       const field = questionDataList.value?.[currentEditOne]?.field
//       if (field) {
//         const questionModule = materialGroup.value?.getQuestionRefByField(field)
//         if (questionModule && questionModule.$el) {
//           questionModule.$el.scrollIntoView({
//             behavior: 'smooth'
//           })
//         }
//       }
//     }, 0)
//   }
// })
</script>

<style lang="scss" scoped>
.main-operation {
  width: 100%;
  height: 100%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f7f9;
}
.pagination-wrapper {
  width: 90%;
  padding-right: 30px;
  margin-right: -30px;
  position: relative;
  top: 50px;
}

.toolbar {
  width: 100%;
  height: 38px;
  background-color: #fff;
  flex-grow: 0;
  flex-shrink: 0;
}

.operation-wrapper {
  margin-top: 50px;
  margin-bottom: 45px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 30px;
  margin-right: -30px;
  scrollbar-width: none;
  width: 90%;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .content {
    background-color: #fff;
    padding-top: 40px;
  }
}
</style>
