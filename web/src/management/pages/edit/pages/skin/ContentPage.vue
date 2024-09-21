<template>
  <CommonTemplate>
    <template #left>
      <CatalogPanel />
    </template>
    <template #center>
      <PreviewPanel />
    </template>
    <template #right>
      <SetterPanel />
    </template>
  </CommonTemplate>
</template>
<script setup lang="ts">
// import { onMounted } from 'vue'
// import { useEditStore } from '@/management/stores/edit'

import CommonTemplate from '../../components/CommonTemplate.vue'
import CatalogPanel from '../../modules/skinModule/CatalogPanel.vue'
import PreviewPanel from '../../modules/skinModule/PreviewPanel.vue'
import SetterPanel from '../../modules/skinModule/SetterPanel.vue'

// const editStore = useEditStore()

// onMounted(() => {
//   editStore.fetchBannerData()
// })
</script>
<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>
