<template>
  <div class="question-edit-form">
    <div class="setter-title">
      {{ currentEditText }}
    </div>
    <SetterField
      class="question-config-form"
      label-position="left"
      :form-config-list="formFields"
      :module-config="moduleConfig"
      @form-change="handleFormChange"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { get as _get } from 'lodash-es'

import statusConfig from '@/management/pages/edit/setterConfig/statusConfig'
import SetterField from '@/management/pages/edit/components/SetterField.vue'

const textMap = {
  Success: '提交成功页面配置',
  OverTime: '问卷过期页面配置'
}

const editStore = useEditStore()
const { currentEditStatus } = storeToRefs(editStore)
const { schema, changeSchema } = editStore

const moduleConfig = toRef(schema, 'submitConf')
const currentEditText = computed(() => (textMap as any)[currentEditStatus.value])
const formFields = computed(() => {
  const formList = (statusConfig as any)[currentEditStatus.value] || []
  const list = formList.map((item: any) => {
    const value = _get(moduleConfig.value, item.key, item.value)

    return { ...item, value }
  })

  return list
})

const handleFormChange = ({ key, value }: any) => {
  changeSchema({
    key: `submitConf.${key}`,
    value
  })
}
</script>
<style lang="scss" scoped>
.question-edit-form {
  width: 360px;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
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

.question-config-form {
  padding: 30px 20px 50px 20px;
}

:deep(.group-wrap) {
  margin-bottom: 0;
  &:not(:last-child) {
    margin-bottom: 32px;
  }

  .group-title {
    margin-bottom: 12px;
  }

  .el-form-item {
    margin-bottom: 16px;

    .el-radio {
      height: initial;
      line-height: initial;
      margin-bottom: initial;
    }
  }
}
</style>
