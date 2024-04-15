<template>
  <el-collapse class="question-type-wrapper" v-model="activeNames">
    <el-collapse-item v-for="(item, index) of questionMenuConfig" :title="item.title" :name="index" :key="index">
      <div class="questiontype-list">
        <el-popover v-for="(item, index) in item.questionList" :key="item.type" placement="right" trigger="hover"
          :popper-class="'qtype-popper-' + (index % 3)"
          :popper-style="{width: '369px'}">
          <img :src="item.snapshot" width="345px" />
          <template #reference>
            <div :key="item.type" class="qtopic-item" @click="onQuestionType({ type: item.type })">
              <i class="iconfont" :class="['icon-' + item.icon]"></i>
              <p class="text">{{ item.title }}</p>
            </div>
          </template>
        </el-popover>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import questionLoader from '@/materials/questions/questionLoader'

import questionMenuConfig, {
  questionTypeList,
} from '@/management/config/questionMenuConfig'
import { getQuestionByType } from '@/management/utils/index'
import { useStore } from 'vuex'
import { get as _get } from 'lodash-es'
import { computed, ref } from 'vue'

const activeNames = ref([0, 1])

const store = useStore()
const questionDataList = computed(() =>
  _get(store, 'state.edit.schema.questionDataList')
)

questionLoader.init({
  typeList: questionTypeList.map((item) => item.type),
})

const onQuestionType = ({ type }) => {
  const fields = questionDataList.value.map((item) => item.field)
  const currentEditOne = _get(store, 'state.edit.currentEditOne')
  const index =
    typeof currentEditOne === 'number'
      ? currentEditOne + 1
      : questionDataList.value.length
  const newQuestion = getQuestionByType(type, fields)
  newQuestion.title = newQuestion.title = `标题${index + 1}`
  if (type === 'vote') {
    newQuestion.innerType = 'radio'
  }
  store.dispatch('edit/addQuestion', { question: newQuestion, index })
  store.commit('edit/setCurrentEditOne', index)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.question-type-wrapper {
  padding: 0 20px;
  border: none;

  :deep(.el-collapse-item__header) {
    font-size: 16px;
    font-weight: bold;
    color: #4a4c5b;
  }
}

.questiontype-list {
  // height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // padding-bottom: 25px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-top: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .qtopic-item {
    height: 77px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border: 1px solid $disable-color;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: $primary-color-light;
      border: 1px solid $primary-color;
    }

    .text {
      font-size: 12px;
    }
  }

  .iconfont::before {
    font-size: 21px;
    color: $font-color-title;
  }

}
</style>

<style lang="scss" rel="stylesheet/scss">
.qtype-popper-0 {
  transform: translateX(183px);
}

.qtype-popper-1 {
  transform: translateX(106px);
}

.qtype-popper-2 {
  transform: translateX(30px);
}
</style>
