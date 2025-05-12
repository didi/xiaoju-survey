<template>
  <el-dialog
    :model-value="visible"
    title="请选择创建方式"
    width="600px"
    custom-class="create-method-dialog"
    @update:modelValue="$emit('update:visible', $event)"
  >
    <div class="method-grid">
      <div 
        v-for="method in methods"
        :key="method.type"
        class="method-card"
        @click="handleSelect(method.type)"
      >
        <img :src="method.icon" class="method-icon"/>
        <h4>{{ method.title }}</h4>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: Boolean
  methods?: Array<{type: string, title: string, icon: string}>
}>()

const emit = defineEmits(['update:visible', 'select'])

const handleSelect = (type: string) => {
  emit('select', type)
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.method-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  .method-card {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    
    .method-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }
  }
}

:deep(.create-method-dialog) {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    padding: 15px 20px;
  }
}
</style>
