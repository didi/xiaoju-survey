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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { get as _get } from 'lodash-es'

import skinConfig from '@/management/config/setterConfig/skinConfig'
import SetterField from '@/management/pages/edit/components/SetterField.vue'

const store = useStore()
const collapse = ref<string>('')
const schema = computed(() => _get(store.state, 'edit.schema'))

const handleFormChange = (data: any, collapse: string) => {
  const { key, value } = data
  const currentEditKey = `${collapse}`
  const resultKey = `${currentEditKey}.${key}`

  store.dispatch('edit/changeSchema', { key: resultKey, value })
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
