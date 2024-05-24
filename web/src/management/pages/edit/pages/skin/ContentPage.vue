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
<script>
import CommonTemplate from '../../components/CommonTemplate.vue'
import CatalogPanel from '../../modules/settingModule/skin/CatalogPanel.vue'
import PreviewPanel from '../../modules/settingModule/skin/PreviewPanel.vue'
import SetterPanel from '../../modules/settingModule/skin/SetterPanel.vue'

export default {
  name: 'ContentPage',
  components: {
    CommonTemplate,
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
