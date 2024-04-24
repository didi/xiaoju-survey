<template>
  <el-tabs type="border-card" v-model="tabSelected" class="tab-box">
    <el-tab-pane label="题型选择">
      <TypeList />
    </el-tab-pane>
    <el-tab-pane label="题目大纲">
      <Catalog />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TypeList from './components/typeList.vue'
import Catalog from './components/catalog.vue'

export default {
  name: 'EditLeftTabPanel',
  data() {
    return {
      tabSelected: '0'
    }
  },
  components: {
    TypeList,
    Catalog
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.tab-box {
  width: 300px;
  height: 100%;
  box-shadow: none;
  border: none;
  overflow-y: auto;
  :deep(.el-tabs__nav) {
    width: 100%;
  }
  :deep(.el-tabs__item) {
    width: 50%;
    text-align: center;
  }
}
</style>
