<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formValues="formValues"
        @formChange="handleChangeData"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import MaterialGroup from './MaterialGroup.vue'
import { useQuestionStore } from '../stores/question'

const store = useStore()
const questionStore = useQuestionStore()

const renderData = computed(() => questionStore.renderData)
const rules = computed(() => store.state.rules)
const formValues = computed(() => store.state.formValues)

const handleChangeData = (data: any) => {
  store.dispatch('changeData', data)
}
</script>
