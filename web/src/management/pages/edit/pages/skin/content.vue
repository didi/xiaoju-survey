<template>
    <commonTemplate>
      <catalogPanel slot="left"></catalogPanel>
      <previewPanel slot="center"></previewPanel>
      <setterPanel slot="right"></setterPanel>
    </commonTemplate>
  </template>
  <script>
  import commonTemplate from '../../components/commonTemplate.vue';
  import catalogPanel from '../../modules/settingModule/skin/catalogPanel.vue';
  import previewPanel from '../../modules/settingModule/skin/previewPanel.vue';
  import setterPanel from '../../modules/settingModule/skin/setterPanel.vue';
  
  export default {
    name: 'editIndex',
    components: {
      commonTemplate,
      catalogPanel,
      previewPanel,
      setterPanel,
    },
    created() {
      this.$store.dispatch('getBannerData');
    }
  };
  </script>
  <style lang="scss" scoped>
  .navbar {
    border-bottom: 1px solid #e7e9eb;
  }
  </style>
  