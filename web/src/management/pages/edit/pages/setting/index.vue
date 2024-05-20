<template>
  <div class="setting-page">
    <SettingPanel></SettingPanel>
  </div>
</template>

<script>
import SettingPanel from '../../modules/settingModule/SettingPanel'
export default {
  name: 'SettingPage',
  components: {
    SettingPanel
  }
}
</script>

<style lang="scss" scoped>
.setting-page {
  width: 100%;
  height: 100%;
}
</style>
