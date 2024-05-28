<template>
  <el-dialog
    class="base-dialog-root"
    :model-value="visible"
    width="40%"
    :title="formTitle"
    @close="onClose"
  >
    <el-form
      class="base-form-root"
      ref="ruleForm"
      :model="formModel"
      :rules="rules"
      label-position="top"
      size="large"
      @submit.prevent
      :disabled="formDisabled"
    >
      <el-form-item label="团队名称" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="空间描述">
        <el-input v-model="formModel.description" />
      </el-form-item>
      <el-form-item label="添加成员" prop="members">
        <MemberSelect
          :members="formModel.members"
          @select="handleMemberSelect"
          @change="handleMembersChange"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="save-btn" @click="onConfirm" v-if="!formDisabled">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, onMounted } from 'vue'
import { useStore } from 'vuex'
import { pick as _pick } from 'lodash-es'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { ModifyType } from '@/management/utils/constant'
import MemberSelect from './MemberSelect.vue'
import { type IMember, type IWorkspace, UserRole } from '@/management/utils/types/workSpace'

const store = useStore()
const emit = defineEmits(['on-close-codify', 'onFocus', 'change', 'blur'])
const props = defineProps({
  type: String,
  width: String,
  visible: Boolean
})
const ruleForm = shallowRef<any>(null)

const formTitle = computed(() => {
  return props.type === ModifyType.ADD ? '创建团队' : '修改团队'
})
const formModel = ref<IWorkspace>({
  name: '',
  description: '',
  members: [] as IMember[]
})
const rules = {
  name: [{ required: true, message: '请输入团队名称', trigger: 'blur' }],
  members: [
    {
      trigger: 'change',
      validator: (rule: any, value: IMember[], callback: Function) => {
        if (props.type === ModifyType.EDIT) {
          if (value.filter((item: IMember) => item.role === UserRole.Admin).length === 0) {
            callback('请至少设置一名空间管理员')
          }
        }
        callback()
      }
    }
  ]
}
const spaceDetail = computed(() => {
  return store.state.list.spaceDetail
})
const formDisabled = computed(() => {
  return spaceDetail.value?._id
    ? store.state.list.teamSpaceList.find((item: any) => item._id === spaceDetail.value._id)
        .currentUserRole !== UserRole.Admin
    : false
})

onMounted(() => {
  if (props.type === ModifyType.EDIT) {
    formModel.value = _pick(spaceDetail.value, ['_id', 'name', 'description', 'members'])
  }
})
const onClose = () => {
  formModel.value = {
    name: '',
    description: '',
    members: [] as IMember[]
  }
  // 清空空间详情
  store.commit('list/setSpaceDetail', null)
  emit('on-close-codify')
}
const onConfirm = async () => {
  ruleForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (props.type === ModifyType.ADD) {
        try {
          await handleAdd()
          emit('on-close-codify', 'update')
        } catch (err) {
          ElMessage.error('createSpace status err' + err)
        }
      } else {
        try {
          await handleUpdate()
          emit('on-close-codify', 'update')
        } catch (err) {
          ElMessage.error('createSpace status err' + err)
        }
      }
    } else {
      return false
    }
  })
}

const handleMemberSelect = (val: string, label: string) => {
  formModel.value.members.push({ userId: val, username: label, role: UserRole.Member })
}
const handleMembersChange = (val: IMember[]) => {
  formModel.value.members = val
}
const handleUpdate = async () => {
  await store.dispatch('list/updateSpace', formModel.value)
}
const handleAdd = async () => {
  await store.dispatch('list/addSpace', formModel.value)
}
</script>

<style lang="scss" rel="lang/scss" scoped>
.base-form-root {
  padding: 20px;
}
</style>
