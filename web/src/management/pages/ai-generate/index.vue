<template>
  <div class="ai-generate-container">
    <!-- 顶部导航栏 -->
    <div class="generate-nav">
      <div class="nav-left">
        <img src="/imgs/s-logo.webp" class="logo" />
        <el-button link @click="goBack">
          <i class="iconfont icon-fanhui"></i>
          返回
        </el-button>
      </div>
      <h2 class="nav-title">AI智能生成问卷</h2>
      <el-button type="primary" @click="handleCreate">确定创建</el-button>
    </div>

    <!-- 主体内容区 -->
    <div class="generate-content">
      <AIChatInput @generate="handleAIGenerate"  />
      <PreviewPanel :ai-content="aiContent" />
    </div>
  </div>
  <el-dialog
  v-model="showAICreateForm"
  title="确定创建"
  width="500"
>
  <CreateForm 
    @cancel="showAICreateForm = false" 
    @confirm="handleAIConfirm"
  />
</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AIChatInput from './components/AIChatInput.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import { textToSchema } from '@/management/utils/textToSchema'
import { ElMessage } from 'element-plus' // 添加消息组件导入
import { createSurvey } from '@/management/api/survey' // 确保导入创建接口
import CreateForm from '@/management/components/CreateForm.vue';

const router = useRouter()
const aiContent = ref('') // 新增状态
// 在脚本部分新增状态和方法
const showAICreateForm = ref(false)
const aiQuestions = ref<Array<any>>([]) // 存储AI生成的题目
const goBack = () => {
  router.go(-1)
}

const handleAIGenerate = (rawContent: string) => {
  aiContent.value = rawContent
    aiQuestions.value = textToSchema(rawContent) // 复用转换逻辑
}

const handleCreate = () => {
  if (aiQuestions.value.length === 0) {
    ElMessage.error('请先生成有效问卷内容')
    return
  }
  showAICreateForm.value = true
}


const handleAIConfirm = async (formValue: { title: string; remark?: string; surveyType: string; groupId?: string }) => {
  try {
    const payload = {
      ...formValue,
      createMethod: 'aiGenerate',
      questionList: aiQuestions.value
    }
    const res = await createSurvey(payload)
    if (res?.data?.id) {
      router.push({ name: 'QuestionEditIndex', params: { id: res.data.id } })
    }
  } catch (e) {
    ElMessage.error('创建失败')
  } finally {
    showAICreateForm.value = false
  }
}


</script>

<style lang="scss" scoped>
.ai-generate-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .generate-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 56px;
    border-bottom: 1px solid #eee;
 
    .nav-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .logo {
        height: 32px;
      }
    }

    .nav-title {
      font-size: 18px;
      color: #333;
    }
  }
}

.generate-content {
  flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;

}

</style>
