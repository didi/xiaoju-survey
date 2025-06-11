<template>
  <div class="ai-import-page">
    <!-- 左侧：AI 提示输入区 -->
    <div class="left-panel">
      <div class="panel-header">
        <span class="panel-title">AI 生成问卷</span>
        <el-button type="primary" link @click="showPromptExamples = true">提示示例</el-button>
      </div>
      <el-input
        type="textarea"
        class="prompt-input"
        v-model="prompt"
        :autosize="{ minRows: 6, maxRows: 12 }"
        placeholder="请输入你希望 AI 帮你生成的问卷需求…"
      />
      <div class="actions">
        <el-button type="primary" @click="onGenerate" :loading="loading">
          生成问卷
        </el-button>
        <el-button @click="clearPrompt">清空</el-button>
      </div>
    </div>

    <!-- 右侧：AI 生成问卷预览 -->
    <div class="right-panel">
      <MultiSourcePreviewPanel :questionDataList="previewQuestionList">
        <div class="placeholder" v-if="questionList.length === 0">
          AI 生成的问卷结果会显示在这里
        </div>
      </MultiSourcePreviewPanel>
    </div>

    <!-- 弹窗：提示示例 -->
    <el-dialog
      v-model="showPromptExamples"
      title="AI 提示示例"
      width="500px"
    >
      <div class="prompt-example-wrapper">
        <div
          v-for="item in promptExamples"
          :key="item.title"
          class="prompt-example-item"
        >
          <p class="example-title">示例：{{ item.title }}</p>
          <div class="example-content">
            <p class="example-text" v-html="item.content"></p>
            <span class="copy-text" @click="copyPrompt(item.content)">
              复制提示
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue';
import { filterQuestionPreviewData } from '@/management/utils/index';
import promptImportExample from '@/management/config/promptImportExample';
import copy from 'copy-to-clipboard';

const emit = defineEmits<{
  (e: 'change', newQuestionList: Record<string, any>[]): void
}>();

// 用户在左侧输入的提示文本
const prompt = ref<string>('');
// 控制“提示示例”弹窗显示
const showPromptExamples = ref<boolean>(false);
// AI 生成的原始问卷列表（schema 格式）
const questionList = reactive<Array<Record<string, any>>>([]);
// AI 请求状态
const loading = ref<boolean>(false);

// 右侧预览使用的数据：从 questionList 过滤出展示所需字段
const previewQuestionList = computed(() => {
  return filterQuestionPreviewData(questionList);
});

// 从配置文件读取的“提示示例”列表
const promptExamples = computed(() => promptImportExample);

// 点击“生成问卷”后触发：调用后端 NestJS 接口，将返回的结果填入 questionList
async function onGenerate() {
  if (!prompt.value.trim()) {
    ElMessage.warning('请先输入提示内容');
    return;
  }
  loading.value = true;
  try {
    // 清空上次结果
    questionList.splice(0, questionList.length);

    // 调用后端提供的 AI 生成接口
    const res = await axios.post('/ai/generate', { demand: prompt.value.trim() });
    if (res.data?.success && Array.isArray(res.data.data)) {
      // 1) 拿到真正的 Array<Schema>
      const schemas = res.data.data;
      // 2) 按照原版 splice 全量替换
      questionList.splice(0, questionList.length, ...schemas);
      // 3) emit 给父组件
      emit('change', [...questionList]);
      ElMessage.success('问卷已生成');
    } else {
      ElMessage.info('AI 未生成有效问卷，请修改提示再试');
    }
  } catch (err: any) {
    console.error(err);
    ElMessage.error('AI 生成失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 清空 prompt 文本和预览
function clearPrompt() {
  prompt.value = '';
  questionList.splice(0, questionList.length);
  emit('change', []);
}

// 点击“复制提示”按钮时，将示例内容复制到剪贴板
function copyPrompt(text: string) {
  copy(text);
  ElMessage({
    type: 'success',
    message: '提示已复制',
  });
}
</script>

<style lang="scss" scoped>
.ai-import-page {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .left-panel,
  .right-panel {
    height: 100%;
  }

  /* 左侧占 40%，右侧占 60% */
  .left-panel {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e3e4e8;
    padding: 20px;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid #e3e4e8;
      padding-bottom: 8px;

      .panel-title {
        font-size: 18px;
        font-weight: bold;
      }
      .el-button {
        font-size: 14px;
      }
    }

    .prompt-input {
      flex: 1;
      margin-top: 16px;
      font-size: 14px;
      line-height: 1.5;
    }

    .actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
      gap: 12px;

      .el-button {
        min-width: 100px;
      }
    }
  }

  .right-panel {
    flex: 0 0 60%;
    padding: 20px;
    position: relative;

    .placeholder {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      color: #999;
      text-align: center;
    }
  }

  /* 弹窗内示例样式 */
  .prompt-example-wrapper {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;

    .prompt-example-item {
      border: 1px solid rgba(227, 228, 232, 1);
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 12px;

      .example-title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .example-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        white-space: pre-wrap;

        .example-text {
          flex: 1;
          font-size: 13px;
          line-height: 1.5;
          color: #333;
        }

        .copy-text {
          margin-left: 12px;
          cursor: pointer;
          color: #FAA600;
          font-size: 12px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
