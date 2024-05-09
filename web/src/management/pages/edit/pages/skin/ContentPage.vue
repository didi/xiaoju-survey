<template>
  <commonTemplate>
    <template #left>
      <CatalogPanel />
    </template>
    <template #center>
      <PreviewPanel />
    </template>
    <template #right>
      <SetterPanel />
    </template>
  </commonTemplate>
</template>
<script>
import commonTemplate from '../../components/CommonTemplate.vue'
import CatalogPanel from '../../modules/settingModule/skin/CatalogPanel.vue'
import PreviewPanel from '../../modules/settingModule/skin/PreviewPanel.vue'
import SetterPanel from '../../modules/settingModule/skin/SetterPanel.vue'

export default {
  name: 'ContentPage',
  components: {
    commonTemplate,
    CatalogPanel,
    PreviewPanel,
    SetterPanel
  },
  created() {
    this.$store.dispatch('getBannerData')
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>
