<template>
  <commonTemplate>
    <template #left>
      <catalogPanel></catalogPanel>
    </template>
    <template #center>
      <previewPanel></previewPanel>
    </template>
    <template #right>
      <setterPanel></setterPanel>
    </template>
  </commonTemplate>
</template>

<script>
import commonTemplate from '../components/CommonTemplate.vue'
import catalogPanel from '../modules/questionModule/CatalogPanel.vue'
import previewPanel from '../modules/questionModule/PreviewPanel.vue'
import setterPanel from '../modules/questionModule/SetterPanel.vue'

export default {
  name: 'editIndex',
  components: {
    commonTemplate,
    catalogPanel,
    previewPanel,
    setterPanel
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>
