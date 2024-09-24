<template>
  <div class="tabs-setter">
    <div class="tabs-header">
      <div
        v-for="item in tabList"
        :class="['tabs-header__item', { active: props.formConfig.value === item.value }]"
        :key="item.value"
        @click="handleTabClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface IProps {
  formConfig: any
}

interface IEmit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmit>()

const tabList = computed(() => {
  return props.formConfig?.options || []
})

function handleTabClick(item: any) {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key, value: item.value })
}
</script>

<style lang="scss" scoped>
.tabs-setter {
  background: #f2f4f7;
  border-radius: 4px;
  width: 100%;
  padding: 4px;

  .tabs-header {
    display: flex;
    width: 100%;
    &__item {
      flex: 1;
      line-height: 24px;
      text-align: center;
      cursor: pointer;

      &.active {
        background: #fff;
      }
    }
  }
}
</style>
