<template>
  <div class="edit-index">
    <LeftMenu class="left"></LeftMenu>
    <div class="right">
      <CommonTemplate style="background-color: #f6f7f9">
        <template #nav>
          <Navbar class="navbar"></Navbar>
        </template>
        <template #body>
          <router-view></router-view>
        </template>
      </CommonTemplate>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import LeftMenu from '@/management/components/LeftMenu.vue'
import CommonTemplate from './components/CommonTemplate.vue'
import Navbar from './components/ModuleNavbar.vue'


const editStore = useEditStore()
const { init, setSurveyId, schema } = editStore

const router = useRouter()
const route = useRoute()

watch(
  () => schema.skinConf,
  (skinConfig) => {
    const root = document.documentElement
    const { themeConf, backgroundConf, contentConf } = skinConfig

    if (themeConf?.color) {
      // 设置主题颜色
      root.style.setProperty('--primary-color', themeConf?.color)
    }

    // 设置背景
    const { color, type, image } = backgroundConf || {}
    root.style.setProperty(
      '--primary-background',
      type === 'image' ? `url(${image}) no-repeat center / cover` : color
    )

    if (contentConf?.opacity.toString()) {
      // 设置全局透明度
      root.style.setProperty('--opacity', `${contentConf.opacity / 100}`)
    }
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(async () => {
  const surveyId = route.params.id as string
  setSurveyId(surveyId)

  try {
    await init()
  } catch (err: any) {
    ElMessage.error(err.message)

    setTimeout(() => {
      router.replace({ name: 'survey' })
    }, 1000)
  }
})
</script>
<style lang="scss" scoped>
.edit-index {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    min-width: 1300px;
    height: 100%;
    padding-left: 80px;
    overflow: hidden;
  }

  .navbar {
    border-bottom: 1px solid #e7e9eb;
  }
}
</style>
