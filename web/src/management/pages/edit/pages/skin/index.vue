<template>
  <div class="skin-content">
    <div class="navbar-tab">
      <el-radio-group v-model="activeRouter">
        <el-radio-button
          v-for="item in routes"
          :key="item.router"
          :label="item.text"
          :value="item.router"
        />
      </el-radio-group>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const routes = [
  {
    text: '内容页',
    router: 'QuestionSkinSetting',
    key: 'skinsettings',
    next: true
  },
  {
    text: '结果页',
    router: 'QuestionEditResultConfig',
    key: 'status'
  }
]

const router = useRouter()
const route = useRoute()
const activeRouter = ref(route.name)

watch(
  activeRouter,
  (val: any) => {
    router.push({ name: val })
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.skin-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;

  .navbar-tab {
    position: absolute;
    top: 10px;
    cursor: pointer;
    z-index: 999;
    :deep(.el-radio-button__original-radio + .el-radio-button__inner) {
      font-size: 12px;
      height: 28px;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: $primary-color;
      background-color: #fff;
    }
  }
}
</style>
