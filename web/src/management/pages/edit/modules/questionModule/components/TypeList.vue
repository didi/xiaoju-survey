<template>
  <el-collapse class="question-type-wrapper" v-model="activeNames">
    <el-collapse-item
      v-for="(item, index) of questionMenuConfig"
      :title="item.title"
      :name="index"
      :key="index"
    >
      <draggable
        class="questiontype-list"
        :list="item.questionList"
        :group="{ name: DND_GROUP, pull: 'clone', put: false }"
        :clone="createNewQuestion"
        item-key="path"
      >
        <template #item="{ element }">
          <div
            :key="element.type"
            class="qtopic-item"
            :id="'qtopic' + element.type"
            @click="onQuestionType({ type: element.type })"
          >
            <i
              class="iconfont"
              :class="['icon-' + element.icon]"
              @mouseenter="showPreview(element, 'qtopic' + element.type)"
              @mouseleave="isShowPreviewImage = false"
              @mousedown="isShowPreviewImage = false"
            ></i>
            <p class="text">{{ element.title }}</p>
          </div>
        </template>
      </draggable>
    </el-collapse-item>
    <Teleport to="body">
      <div class="preview-popover" v-show="isShowPreviewImage" :style="{ top: previewTop + 'px' }">
        <img :src="previewImg" class="preview-image" />
        <span class="preview-arrow"></span>
      </div>
    </Teleport>
  </el-collapse>
</template>

<script setup>
import questionLoader from '@/materials/questions/questionLoader'
import draggable from 'vuedraggable'
import { DND_GROUP } from '@/management/config/dnd'

import questionMenuConfig, { questionTypeList } from '@/management/config/questionMenuConfig'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { ref } from 'vue'

const editStore = useEditStore()
const { newQuestionIndex } = storeToRefs(editStore)
const { addQuestion, setCurrentEditOne, createNewQuestion } = editStore

const activeNames = ref([0, 1])
const previewImg = ref('')
const isShowPreviewImage = ref(false)
const previewTop = ref(0)

questionLoader.init({
  typeList: questionTypeList.map((item) => item.type)
})

const onQuestionType = ({ type }) => {
  const newQuestion = createNewQuestion({ type })
  addQuestion({ question: newQuestion, index: newQuestionIndex.value })
  setCurrentEditOne(newQuestionIndex.value)
}

const showPreview = ({ snapshot }, id) => {
  previewImg.value = snapshot

  const dragEl = document.getElementById(id)
  const { top, height } = dragEl.getBoundingClientRect()
  previewTop.value = top + height / 2

  isShowPreviewImage.value = true
}
</script>

<style lang="scss" scoped>
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
      user-select: none;
    }
  }

  .iconfont::before {
    font-size: 21px;
    color: $font-color-title;
  }
}
</style>

<style lang="scss">
.qtype-popper-0 {
  transform: translateX(183px);
}

.qtype-popper-1 {
  transform: translateX(106px);
}

.qtype-popper-2 {
  transform: translateX(30px);
}
// 设置拖拽到编辑区的样式
.box .qtopic-item {
  height: 2px;
  width: 100%;
  background-color: var(--primary-color);
  * {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.preview-popover {
  position: fixed;
  left: 390px;
  z-index: 9;
  width: 371px;
  padding: 12px;
  background: white;
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
  transform: translateY(-50%);
  animation: fadeIn 100ms linear forwards;

  .preview-image {
    width: 100%;
    object-fit: contain;
  }

  .preview-arrow {
    position: absolute;
    top: 50%;
    left: -6px;
    height: 10px;
    width: 10px;
    transform: translateX(-50%);
    background: var(--el-border-color-light);
    z-index: -1;
    transform: rotate(-45deg);

    &::before {
      position: absolute;
      content: '';
      height: 10px;
      width: 10px;
      border: 1px solid var(--el-border-color-light);
      background: #ffffff;
      border-bottom-color: transparent;
      border-right-color: transparent;
    }
  }
}
</style>
