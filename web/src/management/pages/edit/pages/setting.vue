<template>
  <div class="setting-page">
    <setting></setting>
  </div>
</template>
<script>
import setting from '../modules/settingModule/setting.vue';
export default {
  name: 'questionSettingPage',
  components: {
    setting,
  },
};
</script>
<style lang="scss" scoped>
.setting-page {
  width: 100%;
  height: 100%;
}
</style>
