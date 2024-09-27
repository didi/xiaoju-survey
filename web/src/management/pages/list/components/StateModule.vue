<template>
  <div :class="['list-state', 'list-state-' + status]">
    <span class="list-state-badge" />
    <span>{{ statusMaps[status] }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { statusMaps } from '@/management/config/listConfig'
const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})
const status = computed(() => {
  const {curStatus,subStatus } = props.value;
  return subStatus?.status || curStatus?.status;
})
</script>

<style lang="scss" scoped>
.list-state {
  display: flex;
  align-items: center;
  &-new {
    color: $normal-color;
    .list-state-badge {
      background: $normal-color;
    }
  }
  &-pausing{
    color:  #EB505C;
    .list-state-badge {
      background: #EB505C;
    }
  }
  &-published {
    color: #0dbd93;
    .list-state-badge {
      background: #0dbd93;
    }
  }
  &-editing {
    color: $primary-color;
    .list-state-badge {
      background: $primary-color;
    }
  }
  &-badge {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>
