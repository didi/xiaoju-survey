<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formModel="formModel"
        @formChange="handleChangeData"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

import MaterialGroup from './MaterialGroup.vue'

const store = useStore()

const renderData = computed(() => store.getters?.renderData)
const rules = computed(() => store.state.rules)
const formModel = computed(() => store.getters.formModel)

const handleChangeData = (data: any) => {
  store.dispatch('changeData', data)
}
</script>
