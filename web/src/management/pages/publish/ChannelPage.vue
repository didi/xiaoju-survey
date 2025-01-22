<template>
  <div class="publish-result-page">
    <LeftMenu class="left" />
    <div class="right">
      <div class="topNav">
        <Navbar title="投放管理" />  
      </div>
      <div class="content">
        <template v-if="curStatus !== 'new'">
          <div class="container-content">
            <div class="box-link">
              <!-- <span class="launch-tip"
                >说明：若您的问卷投放对象，涉及14周岁以下的用户，需征得其监护人的同意。</span
              > -->
              <h2>问卷链接</h2>
              <div class="main-channel-wrap">
                <ChannelRow
                  :disable-delete="true"
                  :data="mainChannel"
                  :style-wrap="{ marginBottom: '8px' }"
                />
              </div>
            </div>
            
            <br/>
            <div class="box-channelList">
              <h2>投放列表</h2>
              <div class="main-channel-wrap">
                <ChannelList/>
              </div>
            </div>
            <div class="box-channelList">
              <h2>投放方式</h2>
              <div class="main-channel-wrap">
                <ChannelCards/>
              </div>
            </div>
          </div>
        </template>
        <EmptyIndex v-else :data="defaultConfig" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, toRef } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { useRoute, useRouter } from 'vue-router'
import { get as _get } from 'lodash-es'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import EmptyIndex from '@/management/components/EmptyIndex.vue'
import LeftMenu from '@/management/components/LeftMenu.vue'
import ChannelRow from './components/ChannelRow.vue'
import ChannelList from './components/ChannelList.vue'
import ChannelCards from './components/ChannelCards.vue'
import Navbar from './components/Navbar.vue'

const backgroundImage = '/imgs/phone-bg.webp'
const defaultConfig = {
  title: '问卷未发布',
  desc: '点击发布后，问卷就可以对外投放了哦！',
  img: '/imgs/icons/unpublished.webp'
}

const editStore = useEditStore()
const { schema, init, setSurveyId } = editStore
const metaData = toRef(schema, 'metaData')
const curStatus = computed(() => _get(metaData.value, 'curStatus.status', 'new'))
const mainChannel = computed(() => {
  let fullUrl = ''

  if (metaData.value) {
    fullUrl = `${location.origin}/render/${(metaData.value as any).surveyPath}?t=${Date.now()}`
  }

  return { fullUrl }
})

const route = useRoute()
const router = useRouter()
onMounted(async () => {
  setSurveyId(route.params.id as string)

  try {
    await init()
  } catch (err: any) {
    ElMessage.error(err.message)
    setTimeout(() => {
      router.replace({ name: 'survey' })
    }, 1000)
  }
})
</script>
<style lang="scss" scoped>
.publish-result-page {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    width: 100%;
    height: 100%;
    overflow: hidden;
    

    background: #f6f7f9;
    // padding: 30px 40px 50px 40px;
    padding-left: 80px;
    .topNav{
      width: 100%;
      height: 55px;
      background: #fff;
    }
    .content {
      display: flex;
      height: calc(100% - 90px);
      margin: 20px;
      background-color: #fff;
      overflow: auto;
    }
  }
}

.container-content {
  width: 70%;
  margin: 0 auto;
  padding: 30px 30px 80px;
  border-radius: 2px;
  min-width: 960px;
  .launch-tip {
    font-size: 12px;
    color: #fa881a;
  }

  h2 {
    font-family: PingFangSC-Medium;
    margin: 20px 0;
    font-size: 18px;
    color: #4a4c5b;
    letter-spacing: 0;
    line-height: 26px;
  }
}
</style>
  