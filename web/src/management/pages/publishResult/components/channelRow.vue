<template>
  <div class="channel-row-container" :style="styleWrap" :class="data.vertical ? 'vertical' : ''">
    <div class="normal-row-wrap">
      <div class="left">
        <div class="crc-url-wrap" :class="{ 'no-name': !data.name }">
          <div style="margin-bottom: 16px">
            <el-input
              size="small"
              class="cru-content"
              :model-value="getFullUrl(data)"
              :readonly="true"
            />
          </div>
        </div>
      </div>
      <div class="operate-btn-group">
        <el-tooltip class="item" effect="dark" content="在新页面打开" placement="top">
          <a class="cru-suffix j-open" @click="openPage(getFullUrl(data))">
            <i class="font23 iconfont icon-jinru"></i>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="复制链接" placement="top">
          <a class="cru-suffix j-copy" :data-clipboard-text="getFullUrl(data)" @click="handleCopy">
            <i class="font23 iconfont icon-fuzhi"></i>
          </a>
        </el-tooltip>
        <QRCode class="cru-suffix" :url="getFullUrl(data)" />
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from './QRCode.vue'
import Clipboard from 'clipboard'

export default {
  name: 'ChannelRow',
  components: {
    QRCode
  },
  props: ['data', 'styleWrap'],
  methods: {
    handleCopy() {
      const clipboard = new Clipboard('.j-copy')
      clipboard.on('success', (e) => {
        this.$message({
          type: 'success',
          message: `已复制渠道链接：${e.text}`
        })
      })
    },
    openPage(url) {
      window.open(url)
    },
    getFullUrl(v) {
      const url = v.fullUrl
      const protocol = window.location.protocol
      return `${protocol}//${url.split('//')[1]}`
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-list-wrap div.normal-row-wrap {
  position: relative;
  margin-bottom: 24px;

  .delete-btn {
    position: absolute;
    top: 8px;
    left: 5px;
    cursor: pointer;
  }
}

.channel-row-container div.normal-row-wrap {
  display: flex;
  flex-direction: row;
  position: relative;

  .left {
    display: flex;
    flex-direction: row;
    position: relative;
    width: 500px;
  }

  .crc-url-wrap {
    height: 32px;
    flex-grow: 1;

    &.no-name {
      width: 410px;
    }
  }

  .operate-btn-group {
    display: inline-block;

    .cru-suffix {
      display: inline-block;
      margin-left: 6px;
      height: 32px;
      width: 32px;
      line-height: 32px;
      text-align: center;
      vertical-align: top;
      color: #6e707c;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;

      &:hover {
        background: $background-color-gray;
      }

      :deep(.font23) {
        font-size: 23px;
      }
    }
  }
}
</style>
