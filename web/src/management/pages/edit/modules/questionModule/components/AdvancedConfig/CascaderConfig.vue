<template>
  <div>
    <span class="primary-color" @click="openCascaderConfig"> 选项编辑 > </span>
    <el-dialog title="多级联动编辑" class="cascader-config-wrapper" v-model="configVisible" :append-to-body="true"
      width="706px">
      <div class="placeholder-wrapper">
        <div class="placeholder-wrapper-item" v-for="(item, i) in cascaderData.placeholder" :key="item.hash">
          <div class="placeholder-wrapper-list">
            <div class="placeholder-disable-edit cascader-input" @click="showPlaceholderEdit(item.hash)"
              v-if="editMap[item.hash]">{{ item.text }}</div>
            <el-input placeholder="请输入内容" :id="`input-${item.hash}`" @blur="editMap[item.hash] = true"
              v-model="item.text" v-else class="cascader-input" />
          </div>
          <i-ep-ArrowRight v-if="cascaderData.placeholder.length - 1 > i" style="font-size: 16px;margin:0px 4px;" />
        </div>
      </div>
      <div class="options-wrapper">
        <div class="options-wrapper-panel" v-for="(item, key) in cascaderVal" :key="key">
          <template v-if="key == 0">
            <draggable :list="cascaderData?.children" itemKey="hash">
              <template #item="{ element, index }">
                <div :class="`option-wrapper-item ${element.hash == cascaderVal[key]?.hash ? 'input-active' : ''}`"
                  :key="element.hash" @click="setCascaderVal(element, key)">
                  <el-input v-model="element.text" class="cascader-input">
                    <template #suffix>
                      <i-ep-RemoveFilled v-if="element.hash == cascaderVal[key]?.hash" class="remove-icon"
                        @click.stop="removeCascaderNode(cascaderData, index,key)" />
                    </template>
                  </el-input>
                </div>

              </template>
            </draggable>
          </template>
          <template v-else>
            <div v-if="cascaderVal[key - 1]">
              <draggable :list="cascaderVal[key - 1].children" itemKey="hash">
                <template #item="{ element, index }">
                  <div :class="`option-wrapper-item ${element.hash == cascaderVal[key]?.hash ? 'input-active' : ''}`"
                    :key="element.hash" @click="setCascaderVal(element, key)">
                    <el-input v-model="element.text" class="cascader-input">
                      <template #suffix>
                        <i-ep-RemoveFilled v-if="element.hash == cascaderVal[key]?.hash" class="remove-icon"
                          @click.stop="removeCascaderNode(cascaderVal[key - 1], index,key)" />
                      </template>
                    </el-input>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </div>
      </div>

      <div class="add-node-wrapper">
        <template v-for="(item, key) in cascaderVal" :key="key">
          <div v-if="key == 0 || (cascaderVal[key - 1])" @click="addCascaderNode(key)" class="add-node-item">
            <i-ep-Plus />
            添加选项
          </div>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="configVisible = false">取消</el-button>
          <el-button type="primary" @click="cascaderConfigChange">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useCascaderPull } from '@/management/hooks/useCascaderPull'
import draggable from 'vuedraggable'

const emit = defineEmits(['handleChange'])

const editStore = useEditStore()
const { loadInitData, cascaderVal, cascaderData, addCascaderNode, setCascaderVal, removeCascaderNode } = useCascaderPull()
const configVisible = ref(false)
const editMap = ref({})
const openCascaderConfig = () => {
  init();
  configVisible.value = true
}

const showPlaceholderEdit = (hash) => {
  editMap.value[hash] = false;
  nextTick(() => {
    document.getElementById(`input-${hash}`)?.focus()
  })
}

const init = () => {
  loadInitData(editStore.moduleConfig.cascaderData)
  editMap.value = [];
  cascaderData.value.placeholder.map(v => {
    editMap.value[v.hash] = true
  })
}

const cascaderConfigChange = () => {
  emit('handleChange', { key: 'cascaderData', value: cascaderData.value })
  configVisible.value = false
}


</script>
<style lang="scss" scoped>
.cascader-config-wrapper {
  .placeholder-wrapper {
    display: flex;
  }

  .cascader-input {
    width: 200px;
    height: 32px;
  }

  .placeholder-wrapper-item {
    display: flex;
    align-items: center;
  }

  .placeholder-disable-edit {
    display: flex;
    padding: 1px 11px;
    align-items: center;
    background: #F6F7F9;
    border-radius: 4px;
    cursor: pointer;
  }

  .options-wrapper {
    display: flex;
    overflow-y: auto;

    .options-wrapper-panel {
      margin-top: 24px;
      width: 200px;
      margin-left: 28px;
      height: 252px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .add-node-wrapper {
    display: flex;

    .add-node-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 200px;
      margin-left: 28px;
      font-size: 12px;
      color: $primary-color;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .option-wrapper-item {
    margin-bottom: 12px;
  }

  .input-active {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
    }
  }

  .remove-icon {
    cursor: pointer;
    color: red
  }

  .add-node-wrapper {
    margin-top: 16px;
  }

}

:deep(.el-input__inner) {
  cursor: pointer !important;
}
</style>