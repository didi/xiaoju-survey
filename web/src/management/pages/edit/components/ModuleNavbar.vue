<template>
  <div class="nav">
    <div class="left-group">
      <BackPanel></BackPanel>
      <TitlePanel :style="{ marginLeft: '30px' }" :title="title"></TitlePanel>
    </div>
    <div class="center-group">
      <NavPanel></NavPanel>
    </div>
    <div class="right-group">
      <CooperationPanel>
        <template #content="{ onCooper }">
          <div class="btn" @click="onCooper">
            <i-ep-connection class="view-icon" :size="20" />
            <span class="btn-txt">协作</span>
          </div>
        </template>
      </CooperationPanel>
      <PreviewPanel></PreviewPanel>
      <HistoryPanel></HistoryPanel>
      <SavePanel></SavePanel>
      <PublishPanel></PublishPanel>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { get as _get } from 'lodash-es'

import BackPanel from '../modules/generalModule/BackPanel.vue'
import TitlePanel from '../modules/generalModule/TitlePanel.vue'
import NavPanel from '../modules/generalModule/NavPanel.vue'
import HistoryPanel from '../modules/contentModule/HistoryPanel.vue'
import PreviewPanel from '../modules/contentModule/PreviewPanel.vue'
import SavePanel from '../modules/contentModule/SavePanel.vue'
import PublishPanel from '../modules/contentModule/PublishPanel.vue'
import CooperationPanel from '../modules/contentModule/CooperationPanel.vue'

const store = useStore()
const title = computed(() => _get(store.state, 'edit.schema.metaData.title'))
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');
.view-icon {
  font-size: 20px;
  height: 29px;
  line-height: 29px;
}
.nav {
  width: 100%;
  height: 56px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .center-group {
    height: 100%;
    flex: 1;
    justify-content: center;
  }
  .left-group,
  .right-group {
    position: absolute;
    top: 0;
    height: 100%;
  }
}

.left-group {
  left: 18px;
}
.right-group {
  right: 18px;
}
</style>
