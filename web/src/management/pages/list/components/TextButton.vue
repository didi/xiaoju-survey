<template>
  <div class="text-button-root" @click="onClick">
    <el-button v-bind="{ ...$attrs }">
      <template #icon>
        <StaticIcon :icon="icon" />
      </template>
      {{ option.label }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StaticIcon from './StaticIcon.vue'
const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  icon: {
    type: String
  }
})
const emit = defineEmits(['change'])
const toggleOptionIcons = computed(() => {
  return props.option.icons.slice(1)
})
const iconIndex = ref(0)
iconIndex.value = toggleOptionIcons.value.findIndex((iconItem) => iconItem.isDefaultValue)
const iconsLength = computed(() => {
  return toggleOptionIcons.value.length
})
const currentIconItem = computed(() => {
  let finalIconIndex = iconIndex.value % iconsLength.value
  return toggleOptionIcons.value[finalIconIndex]
})
const onClick = () => {
  iconIndex.value++
  if (iconIndex.value >= iconsLength.value) {
    iconIndex.value = 0
  }

  emit('change', currentIconItem.value.effectValue)
}
</script>

<style lang="scss" scoped>
.text-button-root {
  display: flex;
  align-items: center;
}
.el-button {
  margin-right: 20px;
  font-size: 14px;
  color: #4a4c5b;
}
</style>
