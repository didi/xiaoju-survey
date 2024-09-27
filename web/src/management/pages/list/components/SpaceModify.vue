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
      <el-form-item label="团队空间名称" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="团队空间空间描述">
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
        <el-button @click="onClose" v-if="!formDisabled">取消</el-button>
        <el-button type="primary" class="save-btn" @click="onConfirm" v-if="!formDisabled">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, onMounted } from 'vue'
import { pick as _pick } from 'lodash-es'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { QOP_MAP } from '@/management/utils/constant'
import { type IMember, type IWorkspace, UserRole } from '@/management/utils/workSpace'
import { useWorkSpaceStore } from '@/management/stores/workSpace'

import MemberSelect from '@/management/components/CooperModify/MemberSelect.vue'

const workSpaceStore = useWorkSpaceStore()
const emit = defineEmits(['on-close-codify', 'onFocus', 'change', 'blur'])
const props = defineProps({
  type: String,
  width: String,
  visible: Boolean
})
const ruleForm = shallowRef<any>(null)

const formTitle = computed(() => {
  return props.type === QOP_MAP.ADD ? '创建团队空间' : '管理团队空间'
})
const formModel = ref<Required<IWorkspace>>({
  _id: '',
  name: '',
  description: '',
  members: [] as IMember[]
})
const rules = {
  name: [{ required: true, message: '请输入团队空间名称', trigger: 'blur' }],
  members: [
    {
      trigger: 'change',
      validator: (rule: any, value: IMember[], callback: Function) => {
        if (props.type === QOP_MAP.EDIT) {
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
  return workSpaceStore.spaceDetail
})
const formDisabled = computed(() => {
  return spaceDetail.value?._id
    ? workSpaceStore.workSpaceList.find((item: any) => item._id === spaceDetail.value?._id)
        ?.currentUserRole !== UserRole.Admin
    : false
})

onMounted(() => {
  if (props.type === QOP_MAP.EDIT) {
    formModel.value = _pick(spaceDetail.value as any, ['_id', 'name', 'description', 'members'])
  }
})
const onClose = () => {
  formModel.value = {
    _id: '',
    name: '',
    description: '',
    members: [] as IMember[]
  }
  // 清空空间详情
  workSpaceStore.setSpaceDetail(null)
  emit('on-close-codify')
}

const onConfirm = async () => {
  ruleForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (props.type === QOP_MAP.ADD) {
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
  await workSpaceStore.updateSpace(formModel.value)
}
const handleAdd = async () => {
  await workSpaceStore.addSpace(formModel.value)
}
</script>

<style lang="scss" rel="lang/scss" scoped>
.base-form-root {
  padding: 20px;
}
</style>
