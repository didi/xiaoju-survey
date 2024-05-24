<template>
  <div class="wrapper">
    <el-select-v2
      v-model="value"
      filterable
      remote
      :remote-method="remoteMethod"
      clearable
      :options="options"
      :loading="loading"
      placeholder=""
      @change="handleSelect"
    />
    <MemberList :members="members" @change="handleMemberChange"></MemberList>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults } from 'vue'
import MemberList from './MemberList.vue';
import { getUserList } from '@/management/api/space';
import { type IMember, type ListItem } from '@/management/utils/types/workSpace'
import { CODE_MAP } from '@/management/api/base'

const props = withDefaults(defineProps<{
  members?: IMember[]
}>(), {
  members: () => []
})
const emit = defineEmits(['select', 'change']);

const value = ref('')
const options = ref<ListItem[]>([])
const loading = ref(false)

const remoteMethod = async (query: string) => {
  if (query !== '') {
    loading.value = true
    const res: any = await getUserList(query)
    if (res.code === CODE_MAP.SUCCESS) {
      options.value = res.data.map((item: any) => {
        return {
          value: item.userId,
          label: item.username,
          disabled: props.members.map(item => item.userId).includes(item.userId)
        }
      })
      loading.value = false
    }
  } else {
    options.value = []
  }
}
const handleSelect = (val: string) => {
  value.value = ''
  emit('select', val, options.value?.find(item => item.value === val)?.label)
}
const handleMemberChange = (val: any) => {
  emit('change', val)
}
</script>
<style lang="scss" scoped>
.wrapper{
  width: 100%;
}
</style>
