<template>
  <div class="rule-wrapper">
    <el-form
      :hide-required-asterisk="true"
      class="form"
      ref="ruleForm"
      :inline="true"
      :model="ruleNode"
    >
      <ConditionView
        v-for="(conditionNode, index) in ruleNode.conditions"
        :key="conditionNode.id"
        :index="index"
        :ruleNode="ruleNode"
        :conditionNode="conditionNode"
        @delete="handleDeleteCondition"
      ></ConditionView>
      <div class="target-wrapper">
        <div class="line">
          <span class="desc">则显示</span>
          <el-form-item
            prop="target"
            :rules="[{ required: true, message: '请选择目标', trigger: 'change' }]"
          >
            <el-select
              class="select field-select"
              v-model="ruleTarget"
              placeholder="请选择"
              @change="(val: any) => handleChange(ruleNode, 'target', val)"
            >
              <el-option
                v-for="{ label, value, disabled } in targetQuestionList"
                :key="value"
                :label="label"
                :disabled="disabled && ruleNode.target !== value"
                :value="value"
              >
              </el-option>
              <template #empty> 无数据 </template>
            </el-select>
          </el-form-item>
        </div>
        <i-ep-delete style="font-size: 14px" @click="() => handleDelete(ruleNode.id)" />
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, inject, type ComputedRef } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message-box.scss'
import { RuleNode } from '@/common/logicEngine/RuleBuild'
import { cleanRichText } from '@/common/xss'
import { useEditStore } from '@/management/stores/edit'
import { storeToRefs } from 'pinia'
const editStore = useEditStore()
const { showLogicEngine } = storeToRefs(editStore)
import ConditionView from './ConditionView.vue'

const renderData = inject<ComputedRef<Array<any>>>('renderData') || ref([])

const props = defineProps({
  ruleNode: {
    type: RuleNode,
    default: () => {}
  }
})
const emit = defineEmits(['delete'])
const ruleTarget = computed(() => {
  return props.ruleNode.target
})
const handleChange = (ruleNode: any, key: any, value: any) => {
  switch (key) {
    case 'target':
      ruleNode.setTarget(value)
      break
  }
}
const handleDelete = async (id: any) => {
  await ElMessageBox.confirm('是否确认删除规则？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  emit('delete', id)
}
const handleDeleteCondition = (id: any) => {
  props.ruleNode.removeCondition(id)
}
const ruleForm = shallowRef<any>(null)
const submitForm = () => {
  ruleForm.value?.validate((valid: any) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
}
const targetQuestionList = computed(() => {
  const currntIndexs: number[] = []
  props.ruleNode.conditions.forEach((el) => {
    currntIndexs.push(
      renderData.value.findIndex((item: { field: string }) => item.field === el.field)
    )
  })
  const currntIndex = Math.max(...currntIndexs)
  let questionList = cloneDeep(renderData.value.slice(currntIndex + 1))
  return questionList.map((item: any) => {
    return {
      label: `${item.showIndex ? item.indexNumber + '.' : ''} ${cleanRichText(item.title)}`,
      value: item.field,
      disabled: showLogicEngine.value.findTargetsByScope('question').includes(item.field)
    }
  })
})
defineExpose({
  submitForm
})
</script>
<style lang="scss" scoped>
.rule-wrapper {
  width: 800px;
  padding: 10px 24px;
  border: 1px solid #e3e4e8;
  border-radius: 2px;
  display: flex;
  margin: 12px 0;
  box-sizing: border-box;
  .target-wrapper {
    padding: 24px 0;
    display: flex;
    align-items: center;
  }
  .desc {
    display: inline-block;
    margin-right: 12px;
    color: #333;
    line-height: 32px;
  }
  .el-form-item {
    display: inline-block;
    vertical-align: top !important;
    margin-bottom: 0px;
  }
}
.select {
  width: 200px;
}
</style>
