<template>
  <div class='rule-wrapper'>
    <el-form 
      :hide-required-asterisk="true"
      class="form"
      ref="ruleForm"
      :inline="true"
      :model="ruleNode">
      
      <conditionView 
        v-for="(conditionNode, index) in ruleNode.conditions" 
        :key="index"
        :index="index"
        :ruleNode="ruleNode"
        :conditionNode="conditionNode"
      ></conditionView>
      <span class="desc">满足以上所有</span> <span class="desc">条件，则显示</span> 
      <el-form-item
        prop="target"
        :rules="[
            { required: true, message: '请选择目标', trigger: 'change' },
        ]"
        > 
        <el-select
          class="select field-select"
          v-model="ruleNode.target"
          placeholder="请选择"
          @change="(val) => handleChange(ruleNode, 'target', val)">
          <el-option
            v-for="{ label, value } in targetQuestionList"
            :key="value"
            :label="label"
            :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <i 
        class="iconfont icon-shanchu" 
        style="font-size: 18px; margin-right: 8px"  
        @click="() => handleDelete(ruleNode.id)"
      ></i>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, inject } from 'vue';
import { cloneDeep } from 'lodash-es'
// @ts-ignore
import conditionView from './ConditionView.vue'
// @ts-ignore
import { RuleNode, ConditionNode } from "@/common/logicEngine/domain/RuleBuild";
const renderData = inject('renderData', {
  type: Array,
  default: []
})

const props = defineProps({
  ruleNode: {
    type: RuleNode,
    default: () => {},
  },
})
const emit = defineEmits(['delete'])
const formValue = ref({
  ...props.ruleNode
})
const handleChange = (ruleNode, key, value) => {
  ruleNode.set(key, value)
}
const handleDelete = (id) => {
  emit('delete', id)
}
const ruleForm = shallowRef(null)
const submitForm = () => {
  // @ts-ignore
  ruleForm.value.validate((valid) => {
    if (valid) {
      return  true
    } else {
      return false;
    }
  })
}
const targetQuestionList = computed(() => {
  const currntIndexs:number[] = []
  props.ruleNode.conditions.forEach(el => {
    // @ts-ignore
    currntIndexs.push(renderData.value.findIndex((item) => item.field ===  el.field))
  });
  const currntIndex = Math.max(...currntIndexs)
  // @ts-ignore
  let questionList = cloneDeep(renderData.value.slice(currntIndex+1))
  return questionList.map(item => {
      return {
          label:item.title,
          value:item.field
          // disabled: props.selectedTarget.questionFields.includes(item.field)
      }
  })
})
defineExpose({
  submitForm
})
</script>
<style lang='scss'>
.rule-wrapper { 
  width: 800px;
  padding: 20px;
  margin: 0 auto;
    border: 1px solid #e3e4e8;
    border-radius: 2px;
    display: flex;
    margin: 12px 24px;
  .desc {
    display: inline-block;
    margin-bottom: 12px;
    margin-right: 12px;
    color: #333;
    line-height: 32px;
  }
  .el-form-item{
    display: inline-block;
    vertical-align:top!important
  }
}
.select{
  width:200px;
 
}
</style>