<template>
  <slot name="content" :onCooper="onCooper"></slot>
  <CooperModify :modifyId="cooperId" :visible="cooperModify" @on-close-codify="onCooperClose" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import 'element-plus/theme-chalk/src/message.scss'
import CooperModify from '@/management/pages/list/components/CooperModify.vue';
import { useRoute } from 'vue-router';

defineSlots<{
  content: (scope: { onCooper: () => void }) => any
}>();

const route = useRoute()
const surveyId = route.params?.id as string;
const cooperModify = ref<boolean>(false);
const cooperId = ref<string>('');

const onCooper = (): void => {
  cooperId.value = surveyId;
  cooperModify.value = true;
};

const onCooperClose = (): void => {
  cooperModify.value = false;
};

</script>
<style lang="scss" scoped>

</style>
