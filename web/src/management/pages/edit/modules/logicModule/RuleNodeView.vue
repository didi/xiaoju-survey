<template>
  <div class="rule-wrapper">
    <el-form
      :hide-required-asterisk="true"
      class="form"
      ref="ruleForm"
      :inline="true"
      :model="ruleNode"
    >
      <conditionView
        v-for="(conditionNode, index) in ruleNode.conditions"
        :key="index"
        :index="index"
        :ruleNode="ruleNode"
        :conditionNode="conditionNode"
        @delete="handleDeleteCondition"
      ></conditionView>
      <span class="desc">则显示</span>
      <el-form-item
        prop="target"
        :rules="[{ required: true, message: '请选择目标', trigger: 'change' }]"
      >
        <el-select
          class="select field-select"
          v-model="ruleNode.target"
          placeholder="请选择"
          @change="(val: any) => handleChange(ruleNode, 'target', val)"
        >
          <el-option
            v-for="{ label, value, disabled } in targetQuestionList"
            :key="value"
            :label="label"
            :disabled="disabled"
            :value="value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-icon
        style="font-size: 18px; line-height: 32px"
        @click="() => handleDelete(ruleNode.id)"
      >
        <Delete />
      </el-icon>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, shallowRef, inject } from "vue";
import { cloneDeep } from "lodash-es";
// @ts-ignore
import conditionView from "./ConditionView.vue";
// @ts-ignore
import { RuleNode } from "@/common/logicEngine/domain/RuleBuild";
import { Delete } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { cleanRichText } from '@/common/xss'
const store = useStore();
const renderData = inject("renderData", {
  type: Array,
  default: [],
});

const props = defineProps({
  ruleNode: {
    type: RuleNode,
    default: () => {},
  },
});
const emit = defineEmits(["delete"]);
const formValue = ref({
  ...props.ruleNode,
});
const handleChange = (ruleNode: any, key: any, value: any) => {
  ruleNode.set(key, value);
};
const handleDelete = (id: any) => {
  emit("delete", id);
};
const handleDeleteCondition = (id: any) => {
  props.ruleNode.removeCondition(id);
};
const ruleForm = shallowRef(null);
const submitForm = () => {
  // @ts-ignore
  ruleForm.value.validate((valid) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });
};
const targetQuestionList = computed(() => {
  const currntIndexs: number[] = [];
  props.ruleNode.conditions.forEach((el) => {
    // @ts-ignore
    currntIndexs.push(renderData.value.findIndex((item) => item.field === el.field));
  });
  const currntIndex = Math.max(...currntIndexs);
  // @ts-ignore
  let questionList = cloneDeep(renderData.value.slice(currntIndex + 1));
  return questionList.map((item: any) => {
    return {
      label: cleanRichText(item.title),
      value: item.field,
      disabled: store.state.logic.showLogicEngine
        .findTargetsByScope("question")
        .includes(item.field),
    };
  });
});
defineExpose({
  submitForm,
});
</script>
<style lang="scss" scoped>
.rule-wrapper {
  width: 800px;
  padding: 20px;
  border: 1px solid #e3e4e8;
  border-radius: 2px;
  display: flex;
  margin: 12px 0;
  box-sizing: border-box;
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
  }
}
.select {
  width: 200px;
}
</style>
