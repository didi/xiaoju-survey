<template>
  <CommonTemplate>
    <template #left>
      <ResultCatalog />
    </template>
    <template #center>
      <ResultPreview />
    </template>
    <template #right>
      <ResultSetter />
    </template>
  </CommonTemplate>
</template>
<script setup lang="ts">
import CommonTemplate from '../../components/CommonTemplate.vue'
import ResultCatalog from '../../modules/resultModule/CatalogPanel.vue'
import ResultPreview from '../../modules/resultModule/PreviewPanel.vue'
import ResultSetter from '../../modules/resultModule/SetterPanel.vue'
</script>
