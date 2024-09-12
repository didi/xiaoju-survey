<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.query.t,
  () => {
    location.reload()
  }
)
</script>
