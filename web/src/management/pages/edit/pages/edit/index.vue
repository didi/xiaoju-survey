<template>
  <div class="question-content">
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
    text: '内容设置',
    router: 'QuestionEditIndex',
    key: 'questionEdit'
  },
  {
    text: '逻辑设置',
    router: 'LogicIndex',
    key: 'logicEdit'
  }
]

const router = useRouter()
const route = useRoute()
const activeRouter = ref(route.name)

watch(
  activeRouter,
  (val: any) => {
    // 避免编辑页刷新丢失query
    const query = route.query
    router.push({ name: val, query })
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.question-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  .navbar-tab {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%);
    cursor: pointer;
    :deep(.el-radio-button__original-radio + .el-radio-button__inner) {
      font-size: 12px;
      height: 28px;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      color: $primary-color;
      background-color: #fff !important;
    }
  }
}
</style>
