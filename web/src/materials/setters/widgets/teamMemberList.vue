<template>
  <div class="team-member-wrap">
    <div class="team-tree-wrap">
      <el-tree ref="treeRef" :default-expanded-keys="defaultCheckedKeys" :default-checked-keys="defaultCheckedKeys"
        :data="treeData" empty-text="暂无数据" @check="handleChange" style="height:201px" highlight-current show-checkbox
        node-key="id" :props="defaultProps" />
    </div>
    <div class="member-count">已选择 <span>{{ selectCount }}</span> 人</div>
  </div>
</template>
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])

const store = useStore();
const treeRef = ref(null)
const treeData = ref([])
const defaultCheckedKeys = ref([])
const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleChange = () => {
  const key = props.formConfig.key;
  const userKeys = treeRef.value?.getCheckedKeys(true);
  emit(FORM_CHANGE_EVENT_KEY, { key: key, value: userKeys });
}

const spaceDetail = computed(() => {
  return store.state.list.spaceDetail
})



const selectCount = computed(() => {
  return treeRef.value?.getCheckedKeys(true).length || 0
})

const getSpaceMenus = async () => {
  await store.dispatch('list/getSpaceList')
  store.state?.list?.spaceMenus.map((v) => {
    if (v.id == "group") {
      const promiseList = []
      v.children?.map((item) => {
        promiseList.push(store.dispatch('list/getSpaceDetail', item.id).then(() => {
          treeData.value.push({
            id: item.id,
            label: item.name,
            children: getChildren()
          })
        }))
      })
      Promise.all(promiseList).then(() => {
        nextTick(() => {
          defaultCheckedKeys.value = props.formConfig.value;
        })
      })
    }
  })
}

const getChildren = () => {
  const members = [];
  if (spaceDetail.value?.members?.length > 0) {
    spaceDetail.value.members.map(v => {
      members.push({
        id: v.userId,
        label: v.username,
      })
    })
  }
  return members
}


onMounted(() => {
  getSpaceMenus();
})

</script>
<style lang="scss" scoped>
.team-member-wrap {
  width: 508px;

  .team-tree-wrap {
    background: #FFFFFF;
    border: 1px solid rgba(227, 228, 232, 1);
    border-radius: 2px;
    min-height: 204px;
    max-height: 204px;
    overflow-x: auto;
  }

  .member-count {
    text-align: right;

    span {
      color: $primary-color;
    }
  }
}
</style>