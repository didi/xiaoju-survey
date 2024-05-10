<template>
  <div class="rule-list">
    <RuleNodeView
      v-for="(item, index) in list"
      ref="ruleWrappers"
      :key="item.id"
      :ruleNode="item"
      @delete="handleDetele"
    >
    </RuleNodeView>

    <div class="no-logic" v-if="list.length === 0">
      <img src="/imgs/icons/unselected.webp" />
    </div>

    <el-button type="primary" plain class="add" @click="handleAdd">
      <i-ep-plus class="plus-icon" /> 新增显示逻辑
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useStore } from 'vuex'
import RuleNodeView from './RuleNodeView.vue'

import { RuleNode, ConditionNode } from '@/common/logicEngine/RuleBuild'

const store = useStore()

const list = computed(() => {
  return store.state.logic.showLogicEngine?.rules || []
})

const handleAdd = () => {
  const condition = new ConditionNode()
  const ruleNode = new RuleNode()
  ruleNode.addCondition(condition)
  store.state.logic.showLogicEngine.addRule(ruleNode)
}
const handleDetele = (id: string) => {
  store.state.logic.showLogicEngine.removeRule(id)
}

const ruleWrappers = shallowRef([])

const formValidate = () => {
  return ruleWrappers.value.map((item: any) => {
    return item?.submitForm()
  })
}
const handleValide = () => {
  const validPass = formValidate()
  const result = !validPass.includes(false)
  // result 为ture代表校验不通过
  return !result
}
defineExpose({
  handleValide
})
</script>
<style lang="scss">
.rule-list {
  width: 824px;
  text-align: left;
  margin: 0 auto;
  padding: 12px;
  .add {
    margin: 12px 0;
    width: 100%;

    .plus-icon {
      margin-right: 5px;
    }
  }
}

.no-logic {
  padding: 100px 0 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 200px;
  }
}
</style>
