<template>
  <div :class="['list-state', 'list-state-' + value.curStatus?.status]">
    <span class="list-state-badge" />
    <span>{{ statusMaps[value.curStatus?.status] }}</span>
  </div>
</template>

<script>
import { statusMaps } from '@/management/config/listConfig'
export default {
  name: 'StateModule',
  props: {
    value: Object
  },
  data() {
    return {
      statusMaps
    }
  }
}
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
