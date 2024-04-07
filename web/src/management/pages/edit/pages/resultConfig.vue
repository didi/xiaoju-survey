<template>
  <commonTemplate>
    <template #left>
      <ResultCatalog />
    </template>
    <template #center>
      <ResultPreview />
    </template>
    <template #right>
      <ResultSetter />
    </template>
  </commonTemplate>
</template>

<script>
import commonTemplate from '../components/commonTemplate.vue'
import ResultCatalog from '../modules/settingModule/resultCatalog.vue'
import ResultPreview from '../modules/settingModule/resultPreview.vue'
import ResultSetter from '../modules/settingModule/resultSetter.vue'

export default {
  name: 'editIndex',
  components: {
    commonTemplate,
    ResultCatalog,
    ResultPreview,
    ResultSetter,
  },
}
</script>
