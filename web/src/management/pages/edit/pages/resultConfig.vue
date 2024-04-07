<template>
  <commonTemplate>
    <resultCatalog slot="left"></resultCatalog>
    <resultPreview slot="center"></resultPreview>
    <resultSetter slot="right"></resultSetter>
  </commonTemplate>
</template>

<script>
import commonTemplate from '../components/commonTemplate.vue'
import resultCatalog from '../modules/settingModule/resultCatalog.vue'
import resultPreview from '../modules/settingModule/resultPreview.vue'
import resultSetter from '../modules/settingModule/resultSetter.vue'

export default {
  name: 'editIndex',
  components: {
    commonTemplate,
    resultCatalog,
    resultPreview,
    resultSetter,
  },
}
</script>
