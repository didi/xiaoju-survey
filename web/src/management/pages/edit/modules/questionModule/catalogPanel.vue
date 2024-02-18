<template>
  <el-tabs type="border-card" v-model="tabSelected" class="tab-box">
    <el-tab-pane label="题型选择">
      <type-list />
    </el-tab-pane>
    <el-tab-pane label="题目大纲">
      <catalog />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import typeList from './components/typeList';
import catalog from './components/catalog.vue';

export default {
  name: 'EditLeftTabPanel',
  data() {
    return {
      tabSelected: '0',
    };
  },
  components: {
    typeList,
    catalog,
  },
  methods: {},
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
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
