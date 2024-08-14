<template>
  <el-button text type="primary" ref="buttonRef" v-click-outside="onClickOutside">
    <i class="iconfont icon-gengduo"></i>
  </el-button>

  <el-popover
    ref="popoverRef"
    :width="width"
    :virtual-ref="buttonRef"
    placement="top"
    trigger="hover"
    popper-class="more-tool_popper"
    :popper-options="{ boundariesElement: '.more-tool_root', removeOnDestroy: true }"
    virtual-triggering
  >
    <div :class="[type === 'card' ? 'card-tool_more_ul' : 'table-tool_more_ul', 'popper_body']">
      <div
        v-for="t in tools"
        :key="t.key"
        :class="[type === 'card' ? 'card-tool-li_base' : 'table-tool-li_base', 'popper_con']"
        @click="call(t)"
      >
        <span class="more_con">{{ t.label }}</span>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

defineProps({
  type: String,
  placement: String,
  tools: Array,
  width: {
    type: Number,
    default: 50
  }
})
const emit = defineEmits(['popper', 'call'])
const buttonRef = ref()
const popoverRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const call = (t) => {
  emit('call', {
    key: t.key,
    name: t.label
  })
}
</script>
<style lang="scss" rel="stylesheet/scss">
.el-popover.more-tool_popper {
  min-width: 80px;
  padding: 8px 3px;
  .popper_body {
    .popper_con {
      cursor: pointer;
      height: 28px;
      &:hover {
        background: #fef6e6 100%;
        span.more_con {
          color: #faa600;
        }
      }
      text-align: center;
    }
    .popper_con span.more_con {
      min-width: 76px;
      font-size: 12px;
      font-weight: 400;
      color: $font-color;
      line-height: 28px;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      // line-height: 16px;
      cursor: pointer;
      font-weight: 500;
    }
  }
}
.iconfont {
  font-size: 20px;
}
</style>
