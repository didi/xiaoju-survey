<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formValues="formValues"
        @formChange="changeData"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/render/stores'

import MaterialGroup from './MaterialGroup.vue'

const store = useStore()
const { renderData } = storeToRefs(store)
const { state, changeData } = store
const { rules, formValues } = toRefs(state)
</script>
