<template>
  <div class="container">
    <div v-if="logoImage" class="logo-wrapper">
      <img :style="{ width: !isMobile ? '20%' : logoImageWidth || '20%' }" :src="logoImage" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const logoImage = computed(() => store.state?.bottomConf?.logoImage)
const logoImageWidth = computed(() => store.state?.bottomConf?.logoImageWidth)
const isMobile = computed(() => store.state?.isMobile)
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
}

.logo-wrapper {
  text-align: center;
  font-size: 0;
  padding: 0.1rem 0 0.5rem;
}
</style>
