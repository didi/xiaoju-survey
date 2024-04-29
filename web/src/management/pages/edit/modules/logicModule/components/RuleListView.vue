<template>
  <div class="rule-list">
    <RuleNodeView 
      v-for="(item, index) in list" 
      ref="ruleWrappers"
      :key="index" 
      :ruleNode="item"
      @delete="handleDetele"
    >
    </RuleNodeView>

    <el-button type="primary" plain class="add" size="small" icon="el-icon-plus" @click="handleAdd">新增显示逻辑</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef, computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import RuleNodeView from './RuleNodeView.vue';
// @ts-ignore
import { RuleBuild, RuleNode, ConditionNode } from "@/common/logicEngine/domain/RuleBuild";
// @ts-ignore
import { qAbleList } from '@/management/utils/constant'

const store = useStore()
const props = defineProps({
  renderData: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const handleAdd = () => {
  const condition = new ConditionNode();
  const ruleNode = new RuleNode()
  ruleNode.addCondition(condition);
  store.state.logic.showLogicEngine.addRule(ruleNode)
}
const handleDetele = (id: string) => {
  store.state.logic.showLogicEngine.removeRule(id)
}
const list = computed(() => {
  return store.state.logic.showLogicEngine?.rules || []
})

const ruleWrappers = shallowRef([])

const formValidate = () => {
  return ruleWrappers.value.map((item, index) => {
    // @ts-ignore
    return item?.submitForm()
  })
}
const handleValide = () => {
  const validPass = formValidate()
  const result = !validPass.includes(false)
  // result 为ture代表校验不通过
  return !result
}
defineExpose ({
  handleValide
})
</script>
<style lang="scss">
.rule-list{
  width: 800px;
  text-align: left;
  margin: 0 auto;
}
</style>