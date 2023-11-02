<template>
  <commonTemplate>
    <catalogPanel slot="left"></catalogPanel>
    <previewPanel slot="center"></previewPanel>
    <setterPanel slot="right"></setterPanel>
  </commonTemplate>
</template>
<script>
import commonTemplate from '../components/commonTemplate.vue';
import catalogPanel from '../modules/questionModule/catalogPanel.vue';
import previewPanel from '../modules/questionModule/previewPanel.vue';
import setterPanel from '../modules/questionModule/setterPanel.vue';

export default {
  name: 'editIndex',
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
