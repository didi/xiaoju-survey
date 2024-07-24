<template>
  <div class="title-container">
    <div
      class="title"
      @mouseover="showFullTitle"
      @mousemove="updateTooltipPosition"
      @mouseleave="hideFullTitle"
    >
      {{ title }}
    </div>
    <div
      class="tooltip"
      v-if="tooltipVisible"
      :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }"
    >
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: ''
  }
})

const tooltipVisible = ref(false)
const tooltipPosition = ref({ top: 0, left: 0 })

const showFullTitle = () => {
  tooltipVisible.value = true
}

const updateTooltipPosition = (event: MouseEvent) => {
  tooltipPosition.value = {
    top: event.clientY + 10,
    left: event.clientX + 10
  }
}

const hideFullTitle = () => {
  tooltipVisible.value = false
}
</script>
<style lang="scss" scoped>
.title-container {
  position: relative;
  max-width: 280px;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.tooltip {
  position: fixed;
  z-index: 10;
  background: white;
  padding: 5px;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  white-space: nowrap;
}
</style>
