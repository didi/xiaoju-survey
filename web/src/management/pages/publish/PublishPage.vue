<template>
  <div class="publish-result-page">
    <LeftMenu class="left" />
    <div class="right">
      <template v-if="curStatus !== 'new'">
        <div class="preview-container" :style="{ backgroundImage: `url('${backgroundImage}')` }">
          <iframe :src="mainChannel.fullUrl"></iframe>
        </div>
        <div class="container-content">
          <span class="launch-tip"
            >说明：若您的问卷投放对象，涉及14周岁以下的用户，需征得其监护人的同意。</span
          >
          <h2>问卷链接</h2>
          <div class="main-channel-wrap">
            <ChannelRow
              :disable-delete="true"
              :data="mainChannel"
              :style-wrap="{ marginBottom: '8px' }"
            />
          </div>
        </div>
      </template>
      <EmptyIndex v-else :data="defaultConfig" />
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
    padding-left: 80px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: #f6f7f9;
    padding: 30px 40px 50px 40px;
  }

  .preview-container {
    width: 390px;
    height: 769px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    padding: 117px 38px 67px 38px;
    background-position: 0 0;
    background-size: 100% 100%;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.container-content {
  margin-left: 20px;
  background-color: #fff;
  width: 760px;
  padding: 30px 30px 80px;
  border-radius: 2px;

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
