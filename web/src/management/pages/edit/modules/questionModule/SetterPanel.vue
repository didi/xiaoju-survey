<template>
  <div class="setter-wrapper">
    <el-tabs v-model="confType" type="border-card" stretch>
      <el-tab-pane name="baseConf" label="单题设置">
        <div v-if="currentEditMeta?.title" class="setter-title">
          {{ currentEditMeta?.title || '' }}
        </div>

        <div
          class="no-select-question"
          v-if="editStore.currentEditOne === 'mainTitle' || editStore.currentEditOne === null"
        >
          <img src="/imgs/icons/unselected.webp" />
          <h4 class="tipFont">选中题型可以编辑</h4>
          <span class="tip">来！试试看～</span>
        </div>

        <SetterField
          v-else
          :form-config-list="formConfigList"
          :module-config="moduleConfig"
          @form-change="handleFormChange"
        />
      </el-tab-pane>
      <el-tab-pane name="globalBaseConf" label="整卷设置">
        <SetterField
          :form-config-list="[basicConfig]"
          :module-config="editStore.editGlobalBaseConf.globalBaseConfig"
          @form-change="editStore.editGlobalBaseConf.updateGlobalConfOption"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useEditStore } from '@/management/stores/edit'
import basicConfig from '@/materials/questions/common/config/basicConfig'
import SetterField from '@/management/pages/edit/components/SetterField.vue'

const confType = ref('baseConf')
const editStore = useEditStore()

const { currentEditKey, currentEditMeta, formConfigList, moduleConfig } = storeToRefs(editStore)
const { changeSchema } = editStore
const handleFormChange = (data: any) => {
  const { key, value } = data
  const resultKey = `${currentEditKey.value}.${key}`
  changeSchema({ key: resultKey, value })
  if (key in editStore.editGlobalBaseConf.globalBaseConfig)
    editStore.editGlobalBaseConf.updateCounts('MODIFY', { key, value })
}

watch(
  () => editStore.currentEditOne,
  (newVal) => {
    if (newVal === 0 || (!!newVal && newVal !== 'mainTitle')) {
      confType.value = 'baseConf'
    }
  }
)
</script>

<style lang="scss" scoped>
.setter-wrapper {
  width: 360px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
  .no-select-question {
    padding-top: 125px;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 160px;
      padding: 25px;
    }

    .tip {
      font-size: 14px;
      color: $normal-color;
      letter-spacing: 0;
    }
  }

  .setter-title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: $primary-color;
    padding-left: 20px;
    border-bottom: 1px solid #edeffc;
  }

  :deep(.el-tabs) {
    width: 360px;
    height: 100%;
    border: none;

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__content {
      flex: 1;
      overflow-y: auto;
      padding: 0;

      .config-form {
        padding: 30px 20px 50px 20px;
      }
    }
  }
}
</style>
