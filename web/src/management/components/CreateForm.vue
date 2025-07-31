<template>
  <el-form
    class="new-form"
    label-position="right"
    ref="ruleForm"
    :model="form"
    label-width="100px"
    :rules="rules"
  >
    <el-form-item prop="title" label="问卷名称">
      <el-input
        v-model="form.title"
        :class="form.title ? 'nonempty' : 'empty'"
        placeholder="请输入问卷名称"
      />
      <p class="form-item-tip">该标题可在打开问卷的浏览器顶部展示</p>
    </el-form-item>
    <el-form-item prop="remark" label="问卷备注">
      <el-input
        v-model="form.remark"
        :class="form.remark ? 'nonempty' : 'empty'"
        placeholder="请输入备注"
      />
      <p class="form-item-tip">备注仅自己可见</p>
    </el-form-item>
    <el-form-item prop="surveyType" label="问卷类型">
      <el-radio-group v-model="form.surveyType">
        <el-radio v-for="item in surveyTypeList" :value="item.type" :key="item.type">{{ item.title }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="groupId" label="分组" v-if="menuType === MenuType.PersonalGroup">
      <el-select v-model="form.groupId" placeholder="未分组" clearable>
        <el-option
          v-for="item in groupAllList"
          :key="item?._id"
          :label="item?.name"
          :value="item?._id"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="onCancel" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="onConfirm" :loading="loading">确认</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue';
import { MenuType, GroupState } from '@/management/utils/workSpace'
import { useWorkSpaceStore } from '@/management/stores/workSpace'
import { storeToRefs } from 'pinia';
import { SURVEY_TYPE_LIST } from '../pages/create/types';

const emit = defineEmits<{
  cancel: []
  confirm: [formData: any, callback: (success: boolean) => void]
}>()

const props = defineProps({
  groupId: {
    type: String,
    default: ''
  }
})

const ruleForm = ref<any>(null)
const loading = ref(false)

const workSpaceStore = useWorkSpaceStore()
workSpaceStore.getGroupList()
const { groupAllList, menuType } = storeToRefs(workSpaceStore)

const surveyTypeList = computed(() => SURVEY_TYPE_LIST)

const state = reactive({
  rules: {
    title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }]
  },
  form: {
    title: '问卷调研',
    remark: '问卷调研',
    surveyType: 'normal',
    groupId: props.groupId === GroupState.All || props.groupId === GroupState.Not ? '' : props.groupId
  }
})
const { rules, form } = toRefs(state)

const onCancel = () => {
  emit('cancel')
}

const onConfirm = () => {
  ruleForm?.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      emit('confirm', { ...form.value }, (success: boolean) => {
        loading.value = false
      })
    }
  })
}

</script>
<style scoped></style>