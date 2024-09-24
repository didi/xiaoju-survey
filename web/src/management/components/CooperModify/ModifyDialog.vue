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
      <el-form-item label="添加协作者" prop="members">
        <MemberSelect
          :multiple="true"
          :members="formModel.members"
          :options="cooperOptions"
          @select="handleMemberSelect"
          @change="handleMembersChange"
        >
        </MemberSelect>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" class="save-btn" @click="onConfirm" v-if="!formDisabled">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { getPermissionList, getCollaborator, saveCollaborator } from '@/management/api/space'
import { type IMember, SurveyPermissions } from '@/management/utils/workSpace'
import { CODE_MAP } from '@/management/api/base'

import MemberSelect from './MemberSelect.vue'

const emit = defineEmits(['on-close-codify', 'onFocus', 'change', 'blur'])
const props = withDefaults(
  defineProps<{
    modifyId: string
    visible: boolean
  }>(),
  {
    modifyId: '',
    visible: false
  }
)
const ruleForm = shallowRef<any>(null)

const formTitle = ref('协作管理')

const cooperOptions = ref([])

const fetchPermissionList = async () => {
  const res: any = await getPermissionList()
  if (res.code === CODE_MAP.SUCCESS) {
    cooperOptions.value = res.data.map((item: any) => {
      return {
        label: item.name,
        value: item.value
      }
    })
  } else {
    ElMessage.error(res.errmsg || '获取权限信息失败')
  }
}

const formModel = ref({
  members: [] as IMember[]
})
watch(
  () => props.visible,
  async (val: boolean) => {
    if (val && props.modifyId) {
      try {
        const res: any = await getCollaborator(props.modifyId)
        if (res.code === CODE_MAP.SUCCESS) {
          formModel.value.members = res.data?.map((item: any) => {
            return {
              _id: item._id,
              userId: item.userId,
              username: item.username,
              role: item.permissions
            }
          })
          fetchPermissionList()
        } else {
          formModel.value.members = []
          ElMessage.error(res.errmsg || '获取协作信息失败')
        }
      } catch (err) {
        ElMessage.error('获取协作信息接口请求错误')
      }
    }
  }
)
const rules = {
  members: [
    {
      trigger: 'change',
      validator: (rule: any, value: IMember[], callback: Function) => {
        if (value.filter((item: IMember) => !item.role.length).length) {
          callback('请设置协作者对应权限')
        }
        if (
          value.filter(
            (item: IMember) =>
              item.role.length === 1 && item.role[0] === SurveyPermissions.CollaboratorManage
          ).length
        ) {
          callback('不能单独设置协作者管理')
        }
        callback()
      }
    }
  ]
}
const formDisabled = computed(() => {
  return false
})
const onClose = () => {
  emit('on-close-codify')
}
const onConfirm = async () => {
  ruleForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const collaborators = formModel.value.members.map((i) => {
          const collaborator = {
            userId: i.userId,
            permissions: i.role
          }
          if (i._id) {
            ;(collaborator as any)._id = i._id
          }
          return collaborator
        })
        const res: any = await saveCollaborator({
          surveyId: props.modifyId,
          collaborators
        })
        if (res.code === CODE_MAP.SUCCESS) {
          ElMessage.success('操作成功')
          emit('on-close-codify')
        } else {
          ElMessage.error(res.errmsg || '协作管理接口调用失败')
        }
      } catch (err) {
        ElMessage.error('createSpace status err' + err)
      }
    } else {
      return false
    }
  })
}

const handleMemberSelect = (val: string, label: string) => {
  formModel.value.members.push({
    userId: val,
    username: label,
    role: [
      SurveyPermissions.SurveyManage,
      SurveyPermissions.DataManage,
      SurveyPermissions.CollaboratorManage
    ]
  })
}
const handleMembersChange = (val: IMember[]) => {
  formModel.value.members = val
}
</script>

<style lang="scss" rel="lang/scss" scoped>
.base-form-root {
  padding: 20px;
}
</style>
