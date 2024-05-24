<template>
  <div class="main-operation" @click="onMainClick" ref="mainOperation">
    <div class="operation-wrapper" ref="operationWrapper">
      <div class="box content" ref="box">
        <MainTitle
          :bannerConf="bannerConf"
          :readonly="false"
          :is-selected="currentEditOne === 'mainTitle'"
          @select="onSelectEditOne('mainTitle')"
          @change="handleChange"
        />
        <MaterialGroup
          :current-edit-one="parseInt(currentEditOne)"
          :questionDataList="questionDataList"
          @select="onSelectEditOne"
          @change="handleChange"
          @changeSeq="onQuestionOperation"
          ref="materialGroup"
        />
        <SubmitButton
          :submit-conf="submitConf"
          :readonly="false"
          :skin-conf="skinConf"
          :is-selected="currentEditOne === 'submit'"
          @select="onSelectEditOne('submit')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import communalLoader from '@materials/communals/communalLoader.js'
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'
import { useStore } from 'vuex'

const MainTitle = communalLoader.defineAsyncComponent('MainTitle')
const SubmitButton = communalLoader.defineAsyncComponent('SubmitButton')

const store = useStore()
const mainOperation = ref(null)
const materialGroup = ref(null)

const bannerConf = computed(() => store.state.edit.schema.bannerConf)
const submitConf = computed(() => store.state.edit.schema.submitConf)
const skinConf = computed(() => store.state.edit.schema.skinConf)
const questionDataList = computed(() => store.state.edit.schema.questionDataList)
const currentEditOne = computed(() => store.state.edit.currentEditOne)
const currentEditKey = computed(() => store.getters['edit/currentEditKey'])
const autoScrollData = computed(() => {
  return {
    currentEditOne: currentEditOne.value,
    len: questionDataList.value.length
  }
})

const onSelectEditOne = async (currentEditOne) => {
  store.commit('edit/setCurrentEditOne', currentEditOne)
}

const handleChange = (data) => {
  if (currentEditOne.value === null) {
    return
  }
  const { key, value } = data
  const resultKey = `${currentEditKey.value}.${key}`
  store.dispatch('edit/changeSchema', { key: resultKey, value })
}

const onMainClick = (e) => {
  if (e.target === mainOperation.value) {
    store.commit('edit/setCurrentEditOne', null)
  }
}

const onQuestionOperation = (data) => {
  switch (data.type) {
    case 'move':
      store.dispatch('edit/moveQuestion', {
        index: data.index,
        range: data.range
      })
      break
    case 'delete':
      store.dispatch('edit/deleteQuestion', { index: data.index })
      break
    case 'copy':
      store.dispatch('edit/copyQuestion', { index: data.index })
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

watch(autoScrollData, (newVal) => {
  const { currentEditOne } = newVal
  if (typeof currentEditOne === 'number') {
    setTimeout(() => {
      const field = questionDataList.value?.[currentEditOne]?.field
      if (field) {
        const questionModule = materialGroup.value?.getQuestionRefByField(field)
        if (questionModule && questionModule.$el) {
          questionModule.$el.scrollIntoView({
            behavior: 'smooth'
          })
        }
      }
    }, 0)
  }
})
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
