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
import {
  getMemberList
} from '@/management/api/space'
import { ElMessage } from 'element-plus'

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


const selectCount = computed(() => {
  return treeRef.value?.getCheckedKeys(true).length || 0
})


const getSpaceMenus = async () => {
  const res = await getMemberList();
  if (res.code != 200) {
    ElMessage.error('获取空间成员列表失败');
  }
  const data = res.data;
  data.map((v) => {
    const members = v.members || [];
    treeData.value.push({
      id: v.ownerId,
      label: v.name,
      children: members?.map(v => ({
        id: v.userId,
        label: v.role,
      }))
    })
  })
  defaultCheckedKeys.value = props.formConfig.value;
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