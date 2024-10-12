<template>
  <div class="picker-wrapper" @click.stop>
    <div class="picker-mask" v-show="modelValue" @click.stop="handleCancel"></div>
    <transition name="slide-picker">
      <div class="x-picker" v-show="modelValue">
        <div class="x-picker__header">
          <p class="x-picker__header-left" @click.stop="handleCancel">取消</p>
          <p class="x-picker__header-right" @click.stop="handleConfirm">确定</p>
        </div>
        <div class="x-picker__content">
          <div class="x-picker__content-wrapper"></div>
          <ul class="x-picker__content-box" ref="box" :style="getOffsetY" @touchstart="handleStart"
            @touchend="handleEnd" @touchmove="handleMove">
            <li class="x-picker__content-item" v-for="(item, idx) in list" @click="goItem(idx)" :key="idx" :style="getStyle(Number(idx))">{{
              item?.text }}</li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance,watch } from 'vue'
import useList from './list'
import useEvent from './event'

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { ctx } = getCurrentInstance()
    const $useList = useList(props)
    const $useEvent = useEvent({ emit, ctx })


    watch(()=>props.list,()=>{
      $useList.resetData(0)
      $useList.list.value = props.list  
    })

    return {
      ...$useList,
      ...$useEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.x-picker {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99;
}
.picker-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.50);
  z-index: 98;
}

.x-picker__header {
  display: flex;
  justify-content: space-between;
  padding: 10px 24px;
}

.x-picker__header>p {
  margin: 0;
}

.x-picker__header-left {
  font-size: 14px;
  color: #6E707C;
}

.x-picker__header-center {
  color: gray;
}

.x-picker__header-right {
  font-size: 14px;
  color:  $primary-color;
}

.x-picker__content {
  height: 230px;
  padding: 15px 0;
  margin: 0 24px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.x-picker__content-box {
  flex: 1;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transition: all .2s;
  font-size: 20px;
  transition-timing-function: cubic-bezier(0.23, 1, 0.68, 1);
  transform: translate(-50%, -20px);
}

.x-picker__content-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-18px);
  width: 100%;
  height: 40px;
  border-top: 1px solid #E3E4E8;
  border-bottom: 1px solid #E3E4E8;
}

.x-picker__content-item {
  height: 40px;
  line-height:  40px;
  transition: color .5s;
  text-align: center
}

.slide-picker-enter-active,
.slide-picker-leave-active {
  transition: all .5s;
}

.slide-picker-enter-from,
.slide-picker-leave-to {
  transform: translateY(100%);
}
</style>