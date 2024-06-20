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
import { onMounted } from 'vue'
import { useStore } from 'vuex'

import CommonTemplate from '../../components/CommonTemplate.vue'
import CatalogPanel from '../../modules/settingModule/skin/CatalogPanel.vue'
import PreviewPanel from '../../modules/settingModule/skin/PreviewPanel.vue'
import SetterPanel from '../../modules/settingModule/skin/SetterPanel.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('getBannerData')
})
</script>
<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>
