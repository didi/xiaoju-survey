<template>
  <div class='list-wrapper'>
    <!-- <div class="head">
      <div>空间成员</div>
      <div>角色</div>
    </div> -->
    <div class="content" v-for="(item, index) in list" :key="item.userId">
      <div>{{ item.username }}</div>
      <div class="operation">
        <OperationSelect :options="roleOptions" v-model="item.role" ></OperationSelect>
        <el-button text @click="handleRemove(index)">移除</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, withDefaults } from 'vue'
import { type IMember, type UserRole, roleLabels } from '@/management/utils/types/workSpace'
import OperationSelect from './OperationSelect.vue'

const props = withDefaults(defineProps<{
  members: IMember[]
}>(), {
  members: () => []
})
const emit = defineEmits(['change'])
const list = computed({
  get() {
    return props.members;
  },
  set(value) {
    emit('change', value);
  },
})

// 将 roleLabels 转换为 label、value 数组对象
const roleOptions = Object.keys(roleLabels).map(key => ({
  label: roleLabels[key as UserRole],
  value: key,
}));
const handleRemove = (index: number) => {
  list.value.splice(index, 1)
}
</script>
<style lang="scss" scoped>
.list-wrapper {
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  
  overflow: auto;
  .head{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 0 20px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    
    .operation{
      display: flex;
    }
  }
}
</style>
