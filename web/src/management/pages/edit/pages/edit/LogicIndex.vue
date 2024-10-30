<template>
  <el-tabs
    :modelValue="activeName"
    class="loigc-tabs"
    :before-leave="beforeTabLeave"
    @tab-change="handleChange"
  >
    <el-tab-pane label="显示逻辑" name="showLogic">
      <ShowLogic v-if="activeName == 'showLogic'" />
    </el-tab-pane>
    <el-tab-pane label="跳转逻辑" name="jumpLogic" class="logic-wrapper">
      <JumpLogic v-if="activeName == 'jumpLogic'" />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ShowLogic from '../../modules/logicModule/ShowLogic.vue'
import JumpLogic from '../../modules/logicModule/JumpLogic.vue'
import { ElMessageBox } from 'element-plus'
import { useEditStore } from '@/management/stores/edit'
const editStore = useEditStore()
const { showLogicEngine, jumpLogicEngine } = storeToRefs(editStore)
const props = defineProps({
  active: String
})

const router = useRouter()
const activeName = computed(() => {
  return props.active || 'showLogic'
})
const beforeTabLeave = async () => {
  if (activeName.value === 'showLogic' && !showLogicEngine.value.rules.length) return true
  if (activeName.value === 'jumpLogic' && !jumpLogicEngine.value.rules.length) return true
  const title = `提示`
  const text = `切换到${activeName.value === 'showLogic' ? '跳转' : '显示'}设置后，将丢失当前${activeName.value === 'showLogic' ? '显示' : '跳转'}逻辑设置`
  try {
    await ElMessageBox.confirm(text, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (activeName.value === 'showLogic') {
      // 清空显示逻辑逻辑
      showLogicEngine.value.clear()
    } else {
      // 清空跳转逻辑逻辑
      jumpLogicEngine.value.clear()
    }
    return true
  } catch (err) {
    return false
  }
}
const handleChange = (name: any) => {
  router.push({
    name: 'LogicIndex',
    query: { active: name }
  })
}
</script>
<style lang="scss" scoped>
.loigc-tabs {
  width: 98%;
  height: calc(100% - 48px);
  padding: 10px;
  position: relative;
  top: 24px;

  background-color: #fff;
  :deep(.el-tabs__content) {
    height: calc(100% - 10px);
    padding-bottom: 10px;
    overflow-y: auto;
    :deep(el-tab-pane) {
      height: 100%;
      overflow: auto;
    }
    .logic-wrapper {
      height: 100%;
    }
  }
}
</style>
