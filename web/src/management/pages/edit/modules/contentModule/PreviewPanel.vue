<template>
  <div class="preview-panel">
    <div class="btn preview-btn" @click="dialogTableVisible = true">
      <i-ep-view class="view-icon" :size="20" />
      <span class="btn-txt">预览</span>
    </div>
    <el-dialog
      :z-index="99999"
      top="50px"
      class="preview-config-wrapper"
      :destroy-on-close="true"
      :show-close="false"
      @open="openDialog"
      @closed="closedDialog"
      v-model="dialogTableVisible"
      :width="`${previewTab == 1 ? '398' : '1290'}`"
    >
      <div class="ml75">
        <div class="preview-tab">
          <div
            :class="`preview-tab-item ${previewTab == 1 ? 'active' : ''}`"
            @click="previewTab = 1"
          >
            <i-ep-iphone />
          </div>
          <div
            :class="`preview-tab-item ${previewTab == 2 ? 'active' : ''}`"
            @click="previewTab = 2"
          >
            <i-ep-monitor />
          </div>
          <div
            :class="`preview-tab-item ${previewTab == 3 ? 'active' : ''}`"
            @click="previewTab = 3"
          >
            <i-ep-monitor />
          </div>
        </div>
        <div
          :class="`preview-panel ${previewTab == 1 ? 'phone' : previewTab == 2 ? 'pc' : 'sdk'}`"
        >
          <div class="wrapper" v-if="previewTab !== 3 ">
            <div class="tips-wrapper">
              <i-ep-WarningFilled /> <span>用户预览模式，数据不保存！</span>
            </div>
            <div class="iframe-wrapper" v-loading="loading" element-loading-text="加载中...">
              <iframe
                v-loading="loading"
                id="iframe-preview"
                :src="`/management/preview/${surveyId}`"
                frameborder="0"
                width="100%"
                height="100%"
              ></iframe>
            </div>
            
          </div>
          <div class="sdk-preview" v-else>
            <div >
              <el-image :src="sdkImages[sdkType]" fit="contain"/>
            </div>
            
            <el-button type="primary" @click="changeSdkType" :icon="Switch">预览模式</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Switch } from '@element-plus/icons-vue'
const route = useRoute()

const dialogTableVisible = ref(false)
const previewTab = ref(1)
const surveyId = route.params.id
const loading = ref(true)
const sdkType = ref(0)
const sdkImages = [
  '/imgs/sdk-1.png',
  '/imgs/sdk-2.png',
  '/imgs/sdk-3.png'
  ]
const changeSdkType = () => {
  sdkType.value = (sdkType.value + 1) % 3
}
const openDialog = () => {
  const iframePreview = document.getElementById('iframe-preview')
  if (!iframePreview) return
  iframePreview.onload = function () {
    loading.value = false
  }
}

const closedDialog = () => {
  loading.value = true
}
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');

.preview-panel {
  :deep(.preview-config-wrapper) {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
  }
  .ml75 {
    margin-left: 75px;
  }

  .preview-tab {
    display: flex;
    align-items: center;
    justify-content: center;

    .border-right-none {
      border-right: none;
    }

    .active {
      border-color: $primary-color;
      color: $primary-color;
    }

    .border-left-none {
      border-left: none;
    }

    &-item {
      width: 80px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid rgba(227, 228, 232, 1);
      cursor: pointer;
      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }
    }
  }
  .preview-panel {
    margin-top: 16px;
    &.pc {
      display: flex;
      justify-content: center;
      box-shadow: 0px 2px 10px -2px rgba(82, 82, 102, 0.2);
      height: 726px;
      background: var(--primary-background);
      .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .tips-wrapper {
          justify-content: center;
        }

        .iframe-wrapper {
          width: 636px;
          flex: 1;
          margin-top: 20px;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
      }
    }
    &.phone {
      display: flex;
      align-items: center;
      justify-content: center;

      .wrapper {
        background: url('/imgs/preview-phone.png') no-repeat;
        width: 328px;
        height: 678px;
        background-size: 100% 100%;
        padding: 0 14px;
        padding-top: 58px;
        padding-bottom: 14px;
        display: flex;
        flex-direction: column;
        .iframe-wrapper {
          height: 100%;
        }
      }
      iframe {
        border-radius: 0px 0px 20px 20px;
      }
    }
    &.sdk { 
      display: flex;
      justify-content: center;
      box-shadow: 0px 2px 10px -2px rgba(82, 82, 102, 0.2);
      height: 726px;
      background: #F6F7F9;
      .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .tips-wrapper {
          justify-content: center;
        }

        .iframe-wrapper {
          width: 636px;
          flex: 1;
          margin-top: 20px;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
        }
      }
    }
  }
  .tips-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    background: $primary-bg-color;
    color: $primary-color;
    font-size: 12px;
    padding: 2px 0;
    padding-left: 9px;

    span {
      margin-left: 5px;
    }
  }
  .sdk-preview{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .el-image{
      width: 100%;
      height: 100%;
    }
    .el-button{
      position: absolute;
      right: 8px;
      bottom: 24px;
    }
  }
}
</style>
