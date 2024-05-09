<template>
  <div class="condition-wrapper">
    <span class="desc">如果</span>
    <el-form-item
      :prop="`conditions[${index}].field`"
      :rules="[{ required: true, message: '请选择题目', trigger: 'change' }]"
    >
      <el-select
        class="select field-select"
        v-model="conditionNode.field"
        placeholder="请选择题目"
        @change="(val: any) => handleChange(conditionNode, 'field', val)"
      >
        <el-option
          
          v-for="{ label, value } in fieldList"
          :key="value"
          :label="label"
          :value="value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <span class="desc">选择了</span>
    <el-form-item
      class="select value-select"
      :prop="`conditions[${index}].value`"
      :rules="[{ required: true, message: '请选择选项', trigger: 'change' }]"
    >
      <el-select
        v-model="conditionNode.value"
        placeholder="请选择选项"
        multiple
        @change="(val:any) => handleChange(conditionNode, 'value', val)"
      >
        <el-option
          v-for="{ label, value } in getRelyOptions"
          :key="value"
          :label="label"
          :value="value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <span class="desc">中的任一选项 </span>
    <i
      class="iconfont icon-chuangjian"
      style="font-size: 18px; margin-right: 8px"
      @click="handleAdd"
    ></i>
    <el-icon v-if="index > 0" @click="() => handleDelete(conditionNode.id)">
      <Minus />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed, inject, ref } from 'vue';
import { ConditionNode, RuleNode } from "@/common/logicEngine/domain/RuleBuild";
import { qAbleList } from '@/management/utils/constant.js'
import { Minus } from '@element-plus/icons-vue'
import { cleanRichText } from '@/common/xss'

const renderData = inject('renderData', {
  type: Array<Object>,
  default: () => {
    return []
  }
})
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  ruleNode: {
    type: RuleNode,
    default: () => {
      return {}
    }
  },
  conditionNode: {
    type: ConditionNode,
    default: () => {
      return {
        field: '',
        operator: '',
        value: '',
      }
    }
  },
})
const fieldList = computed(() => {
  // @ts-ignore
  return renderData.value.filter(question => qAbleList.includes(question.type))
    .map((item: any) => {
      return {
        label: `${item.showIndex ? item.indexNumber + '.' :''} ${cleanRichText(item.title)}`,
        value: item.field,
      }
    })
})
const getRelyOptions = computed(() => {
  const { field } = props.conditionNode
  if(!field) {
    return []
  }
  // @ts-ignore
  const currentQuestion = renderData.value.find(item => item.field === field)
  return currentQuestion?.options.map((item:any) => {
    return {
      label: cleanRichText(item.text),
      value: item.hash,
    }
  }) || []

})

const handleChange = (conditionNode: ConditionNode, key: string, value: any) => {
  switch(key) {
    case 'field':
      conditionNode.setField(value)
      break;
    case 'operator':
      conditionNode.setOperator(value)
      break;
    case 'value':
      conditionNode.setValue(value)
      break;
  }

}
const handleAdd = () => {
  props.ruleNode.addCondition(new ConditionNode())
}
const emit = defineEmits(['delete'])
const handleDelete = (id: any) => {
  emit('delete', id)
}
</script>
<style lang="scss" scoped>
.condition-wrapper {
  width: 100%;
  &:not(:last-child)::after {
    content: "";
    display: block;
    width: calc(100% - 50px);
    border-top: 1px dashed #e3e4e8;
    padding: 10px 0;
  }
  .desc {
    display: inline-block;
    margin-bottom: 12px;
    margin-right: 12px;
    color: #333;
    line-height: 32px;
  }
  .el-form-item {
    display: inline-block;
    vertical-align: top !important;
    margin-right: 12px;
  }
}
.select {
  width: 200px;
}
</style>
