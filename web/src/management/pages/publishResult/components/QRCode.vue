<template>
  <div class="qrcode" @mouseover="inQcode = true" @mouseout="inQcode = false">
    <div class="qcode-mask">
      <el-popover
        ref="popover"
        :popper-class="'serve-qrcode-popover'"
        placement="top"
        trigger="hover"
      >
        <img :src="qRCodeImg" width="120" height="120" />
      </el-popover>
      <el-button v-popover:popover>
        <i style="font-size: 24px" class="iconfont icon-erweima"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QRCode',
  props: ['url'],
  data() {
    return {
      inQcode: false,
      qRCodeImg: '',
    }
  },
  methods: {
    initQRCodeImg() {
      QRCode.toDataURL(this.url)
        .then((url) => {
          this.qRCodeImg = url
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
  watch: {
    url: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.initQRCodeImg()
          })
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.qrcode {
  display: inline-block;
  overflow: hidden;

  .qcode-mask {
    display: flex;

    .el-button {
      color: #6e707c;
      height: 32px;
      line-height: 32px;
      width: 32px;
      padding: 0;
      border: none;
      background: transparent;
      font-size: 12px;
      text-align: center;
      transition: all 0.2s;
      &:hover {
        background: $background-color-gray;
        color: #6e707c;
        border: none;
      }
    }
  }
}

.el-popover.serve-qrcode-popover {
  height: 122px;
  min-width: 0;
  padding: 0;
}
</style>
