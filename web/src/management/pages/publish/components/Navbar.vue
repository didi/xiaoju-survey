<template>
  <div class="navbar">
    <div class="left-group">
      <BackPanel></BackPanel>
      <TitlePanel :style="{ marginLeft: '30px' }" :title="title"></TitlePanel>
    </div>
  </div>
</template>    
<script lang="ts" setup>
import { defineProps } from 'vue'
import BackPanel from '../../edit/modules/generalModule/BackPanel.vue'
import TitlePanel from '../../edit/modules/generalModule/TitlePanel.vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 56px;
  position: relative;
  display: flex;
  background-color: #fff;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .left-group {
    margin-left: 20px;
  }
}
</style>