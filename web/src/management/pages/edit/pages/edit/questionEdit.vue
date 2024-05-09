<template>
  <commonTemplate>
    <template #left>
      <catalogPanel  />
    </template>
    <template #center>
      <previewPanel />
    </template>
    <template #right>
      <setterPanel />
    </template>
  </commonTemplate>
</template>
<script>
import commonTemplate from '../../components/CommonTemplate.vue';
import catalogPanel from '../../modules/questionModule/CatalogPanel.vue';
import previewPanel from '../../modules/questionModule/PreviewPanel.vue';
import setterPanel from '../../modules/questionModule/SetterPanel.vue';
export default {
  name: 'editInde1111x',
  components: {
    commonTemplate,
    catalogPanel,
    previewPanel,
    setterPanel,
  },
};
</script>
<style lang="scss" scoped>
.navbar {
  border-bottom: 1px solid #e7e9eb;
}
</style>