<template>
  <commonTemplate>
    <resultCatalog slot="left"></resultCatalog>
    <resultPreview slot="center"></resultPreview>
    <resultSetter slot="right"></resultSetter>
  </commonTemplate>
</template>
<script>
import commonTemplate from '../../components/commonTemplate.vue';
import resultCatalog from '../../modules/settingModule/result/catalogPanel.vue';
import resultPreview from '../../modules/settingModule/result/previewPanel.vue';
import resultSetter from '../../modules/settingModule/result/setterPanel.vue';

export default {
  name: 'editIndex',
  components: {
    commonTemplate,
    resultCatalog,
    resultPreview,
    resultSetter,
  },
};
</script>
<style lang="scss" scoped></style>
