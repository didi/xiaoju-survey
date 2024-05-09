<template>
  <commonTemplate>
    <template #left>
      <CatalogPanel></CatalogPanel>
    </template>
    <template #center>
      <PreviewPanel></PreviewPanel>
    </template>
    <template #right>
      <SetterPanel></SetterPanel>
    </template>
  </commonTemplate>
</template>

<script>
import commonTemplate from '../components/CommonTemplate.vue'
import CatalogPanel from '../modules/questionModule/CatalogPanel.vue'
import PreviewPanel from '../modules/questionModule/PreviewPanel.vue'
import SetterPanel from '../modules/questionModule/SetterPanel.vue'

export default {
  name: 'EditPage',
  components: {
    commonTemplate,
    CatalogPanel,
    PreviewPanel,
    SetterPanel
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>
