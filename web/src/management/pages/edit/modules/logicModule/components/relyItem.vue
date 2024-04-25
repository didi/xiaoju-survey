<template>
  <el-form 
    class="form"
    ref="ruleForm"
    size="small"
    :inline="true"
    :model="formValue">
    <div class="line">
      relyitem
      <div class='condition-list'>
        <div class="condition-item" v-for="(item, index) in conditions" :key="index">
          <span>如果</span>&nbsp;
          <el-form-item>
            <!-- <el-select
              v-model="item.questionId"
              placeholder="请选择"
              @change="handleChange(item)">
              <el-option
                v-for="(option, index) in questionList"
                :key="index"
                :label="option.title"
                :value="option.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </div>
      </div>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  questionList: {
    type: Array,
    default: () => [],
  },
  conditions: {
    type: Array,
    default: () => [],
  },
})
const formValue = ref({})
</script>