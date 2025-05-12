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
      <AIChatInput />
      <PreviewPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AIChatInput from './components/AIChatInput.vue'
import PreviewPanel from './components/PreviewPanel.vue'


const router = useRouter()
const prompt = ref('')

const goBack = () => {
  router.go(-1)
}

const handleCreate = () => {
  // 后续补充创建逻辑
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
    // gap: 24px;
    // padding: 24px;

}

</style>
