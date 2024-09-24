<template>
  <div class="wrapper">
    <el-select-v2
      v-model="value"
      filterable
      remote
      :remote-method="remoteMethod"
      clearable
      :options="selectOptions"
      :loading="loading"
      placeholder="请输入账号名搜索"
      @change="handleSelect"
    />
    <MemberList
      :members="members"
      :options="options"
      @change="handleMemberChange"
      :multiple="multiple"
    >
    </MemberList>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MemberList from './MemberList.vue'
import { getUserList } from '@/management/api/space'
import {
  type IMember,
  type ListItem,
  type UserRole,
  roleLabels
} from '@/management/utils/workSpace'
import { CODE_MAP } from '@/management/api/base'
import { useUserStore } from '@/management/stores/user'

const userStore = useUserStore()
const props = withDefaults(
  defineProps<{
    members?: IMember[]
    options?: ListItem[]
    multiple?: boolean
  }>(),
  {
    members: () => [],
    options: () => {
      return Object.keys(roleLabels).map((key) => ({
        label: roleLabels[key as UserRole],
        value: key
      }))
    },
    multiple: false
  }
)
const emit = defineEmits(['select', 'change'])

const value = ref('')
const selectOptions = ref<ListItem[]>([])
const loading = ref(false)

const remoteMethod = async (query: string) => {
  if (query !== '') {
    loading.value = true
    const res: any = await getUserList(query)
    if (res.code === CODE_MAP.SUCCESS) {
      selectOptions.value = res.data.map((item: any) => {
        // 不可以选中自己
        const currentUser = item.username === userStore.userInfo?.username
        return {
          value: item.userId,
          label: item.username,
          disabled: props.members.map((item) => item.userId).includes(item.userId) || currentUser
        }
      })
      loading.value = false
    }
  } else {
    selectOptions.value = []
  }
}
const handleSelect = (val: string) => {
  value.value = ''
  emit('select', val, selectOptions.value?.find((item) => item.value === val)?.label)
}
const handleMemberChange = (val: any) => {
  emit('change', val)
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
</style>
