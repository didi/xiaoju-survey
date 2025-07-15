<template>
  <div class="flex">
    {{ props.value._id }}
    <el-tag style="margin-left: 12px" @click.stop="onCopy">
      复制
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import copy from 'copy-to-clipboard'
import { ElMessage } from 'element-plus';

defineOptions({
  name: 'CopyText'
})

type ChildProps = {
  value: Record<string, any>
}

const props = withDefaults(defineProps<ChildProps>(), {
  // eslint-disable-next-line vue/require-valid-default-prop
  value: () => ({ _id: '' })
});

function onCopy() {
  const data = copy(props.value._id)
  if (data) {
    ElMessage({
      type: 'success',
      message: '复制成功！'
    })
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
</style>