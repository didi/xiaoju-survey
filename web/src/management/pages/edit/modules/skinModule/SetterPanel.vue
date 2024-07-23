<template>
  <div class="setter-wrapper">
    <div class="setter-title">样式设置</div>
    <div class="setter-content">
      <el-collapse v-model="collapse">
        <el-collapse-item
          v-for="(collapse, index) in skinConfig"
          :key="index"
          :title="collapse.name"
          :name="collapse.key"
        >
          <SetterField
            :form-config-list="collapse.formConfigList"
            :module-config="_get(schema, collapse.key, {})"
            @form-change="
              (key) => {
                handleFormChange(key, collapse.key)
              }
            "
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { get as _get } from 'lodash-es'

import skinConfig from '@/management/pages/edit/setterConfig/skinConfig'
import SetterField from '@/management/pages/edit/components/SetterField.vue'

const editStore = useEditStore()
const { schema, changeSchema } = editStore
const collapse = ref<string>('')

const handleFormChange = (data: any, collapse: string) => {
  const { key, value } = data
  const currentEditKey = `${collapse}`
  const resultKey = `${currentEditKey}.${key}`

  changeSchema({ key: resultKey, value })
}
</script>
<style lang="scss" scoped>
.setter-wrapper {
  width: 360px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
}

.setter-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: $primary-color;
  padding-left: 20px;
  // background: #f9fafc;
  border-bottom: 1px solid #edeffc;
}
.setter-content {
  padding: 10px 20px;
  .el-collapse {
    border: none;
    :deep(.el-collapse-item__header) {
      font-size: 14px;
      color: #606266;
      font-weight: bold;
      border: none;
    }
    :deep(.el-collapse-item__wrap) {
      border: none;
      .el-collapse-item__content {
        padding-bottom: 0px !important;
      }
    }
  }
  .config-form {
    padding: 0 !important;
  }
}
</style>
