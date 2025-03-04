<template>
  <div class="text-import-page">
    <MultiSourcePreviewPanel :questionDataList="previewQuestionList">
      <div class="text-import-wrapper">
        <div class="nav">
          <span>输入区</span>
          <el-button type="primary" link @click="showExample = true">输入示例</el-button>
        </div>
        <textarea class="text-input" v-model="text" @input="onInput" ></textarea>
        <p v-if="!text" class="custom-placeholder">输入区</p>
      </div>
    </MultiSourcePreviewPanel>
    <el-dialog
      v-model="showExample"
      title="编辑示例"
      width="500"
    >
      <div class="question-example-wrapper">
        <div v-for="item in importExamples" :key="item.type" :id="`copy-${item.type}-example-wrapper`" class="questionType-example">
          <p class="example-title">示例：{{item.title}}</p>
          <div class="example-content">
            <p :class='`copy-${item.type}-example`' v-html="item.content"></p>
            <span class="copy-text" @click="coypText(item)">复制文本</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue';
import { computed, reactive, ref } from 'vue';
import { debounce } from 'lodash-es'
import { textToSchema } from '@/management/utils/textToSchema';
import { filterQuestionPreviewData } from '@/management/utils/index'
import textImportExample from '@/management/config/textImportExample'
import copy from 'copy-to-clipboard'
import { ElMessage } from 'element-plus';


const emit = defineEmits(['change'])

const text = ref('')
const showExample = ref(false)


const questionList = reactive([] as Array<Record<string, any>>)

const debouncedTransform = debounce(() => {
  if (questionList.length === 0) {
    questionList.push(...textToSchema(text.value))
    emit('change', [...questionList])
    return
  }
  questionList.splice(0, questionList.length, ...textToSchema(text.value))
  emit('change', [...questionList])
}, 500)

const previewQuestionList = computed(() => {
  const ret = filterQuestionPreviewData(questionList)
  return ret
})

const importExamples = computed(() => {
  return textImportExample
})
const onInput = () => {
  debouncedTransform()
}

const coypText = (item: { content: string }) => {
  const data = copy(item.content)
  if (data) {
    ElMessage({
      type: 'success',
      message: '复制成功！'
    })
  }
}

</script>

<style lang="scss" scoped>
.text-import-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;
  .text-input {
    border: none;
  }
}
.text-import-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .nav {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e3e4e8;
    padding: 0 30px;
  }
  .text-input {
    width: 100%;
    height: 100%;
    padding: 30px;
  }
  .custom-placeholder {
    font-family: PingFangSC-Medium;
    font-size: 88px;
    color: #e3e4e8;
    letter-spacing: 0;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 40%;
  }
}
.question-example-wrapper {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.questionType-example {
  width: 100%;
  border: 1px solid rgba(227,228,232,1);
  border-radius: 2px;
  margin-top: 18px;
  padding: 10px;
  .example-title {
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .example-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    white-space: pre;
    .copy-text {
      cursor: pointer;
      color: #FAA600;
      font-size: 12px;
    }
  }
}
</style>
