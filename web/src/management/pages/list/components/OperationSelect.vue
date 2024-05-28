<template>
  <div class="operation">
    <el-select
      size="small"
      :multiple="multiple"
      v-model="value"
      placeholder="请选择"
      :style="{width: `${multiple? 226 : 100}px`}"
      popper-class="custom-header"
      @change="handleChange"
      class="operation-select"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #header v-if="multiple">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          @change="handleCheckAll"
        >
          全部权限
        </el-checkbox>
      </template>
      <template #tag v-if="multiple">
          <el-tag type="primary" v-if="value.length === options.length">全部权限</el-tag>
          <el-tag v-for="chose in value" :key="chose" v-else>{{ chosenLabel(chose) }}</el-tag>
      </template>
      <template #footer>
        <el-button link  type="danger" @click="handleClick"> &nbsp;&nbsp;删除</el-button>
      </template>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { type Ref, ref, computed, watch } from 'vue'
import { ElMessageBox, type CheckboxValueType } from 'element-plus'

import 'element-plus/theme-chalk/src/message-box.scss'
import { type ListItem } from '@/management/utils/types/workSpace'

const props = withDefaults(
  defineProps<{
    multiple?: boolean
    modelValue: string | string[]
    options: ListItem[],
    width?: number,
  }>(),
  {
    multiple: false,
    modelValue: '',
    options: () => [],
    width: 100
  }
)
const emit = defineEmits(['update:modelValue', 'change', 'customClick'])
const value = computed({
  get() {
    if(props.multiple) {
      // 如果是多选处理全部选中状态
      if (props.modelValue.length === 0) {
        checkAll.value = false
        indeterminate.value = false
      } else if (props.modelValue.length === props.options.length) {
        checkAll.value = true
        indeterminate.value = false
      } else {
        indeterminate.value = true
      }
    }
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const chosenLabel = computed(() => {
  return (chose: string) => {
    return props.options.find((i) => i.value === chose)?.label
  }
  
})
const handleChange = (val: string | string[]) => {
  emit('change', val)
}
const handleClick = () => {
  const text = props.multiple ? '删除协作者后，用户不再有该问卷下的相关权限' : '删除团队成员后，该成员不再有团队空间的访问权限'
  ElMessageBox.confirm(text, '是否确认本次删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    emit('customClick')
  }).catch((() => {}))
  
}

const checkAll = ref(false)
const indeterminate = ref(false)

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    value.value = props.options.map((_) => _.value)
  } else {
    value.value = []
  }
}

</script>
<style lang="scss" scoped>
.operation{
  :deep(.el-select__wrapper) {
    border:none;
    box-shadow: none;
  }
  :deep(.ishovering) {
    border:none;
    box-shadow: none;
  }
  :deep(.el-select__selection,.is-near) {
    display: flex;
    justify-content: flex-end;
  }
  .operation-select{
    :deep(.el-select__placeholder) {
      text-align: right;
    }
  }
}

</style>
<style lang="scss">
.custom-header {
  .el-checkbox {
    display: flex;
    height: 22px;
  }
}
</style>