<template>
  <Transition name="fade">
    <div class="pickerbox" v-show="props.visible" @click="clickMask">
      <Transition name="toup">
        <div class="vue-picker" ref="picker" v-show="props.visible">
          <PickerHeader v-if="showToolbar" :cancelText="props.cancelText" :confirmText="props.confirmText" :title="props.title" @cancel="cancel"
            @confirm="confirm" />
          <div class="content" :style="{ height: boxHeight + 'px' }">
            <div class="colums">
              <PickerList :column="state.column1" :boxHeight="boxHeight" :itemHeight="props.itemHeight" :defaultIndex="state.dIndex1"
                :rowNumber="getRowNumber" @change="change1" />
              <PickerList v-if="state.column2.length > 0" :column="state.column2" :boxHeight="boxHeight" :itemHeight="props.itemHeight"
                :defaultIndex="state.dIndex2" :rowNumber="getRowNumber" @change="change2" />
              <PickerList v-if="state.column3.length > 0" :column="state.column3" :boxHeight="boxHeight" :itemHeight="props.itemHeight"
                :defaultIndex="state.dIndex3" :rowNumber="getRowNumber" @change="change3" />
              <PickerList v-if="state.column4.length > 0" :column="state.column4" :boxHeight="boxHeight" :itemHeight="props.itemHeight"
                :defaultIndex="state.dIndex4" :rowNumber="getRowNumber" @change="change4" />
            </div>
            <div class="mask" :style="maskStyle"></div>
            <div class="hairline"></div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, computed, nextTick, ref, watch,onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import PickerHeader from './pickerHeader.vue'
import PickerList from './pickerList.vue'
import { DEFTAULT_ITEM_HEIGHT } from './utils'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  },
  layer: {
    type: Number,
    default: 0
  },
  itemHeight: {
    type: [Number, String],
    default: DEFTAULT_ITEM_HEIGHT
  },
  defaultIndex: {
    type: [Number, Array],
    default: 0
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  title: {
    type: String,
    default: ''
  },
  showToolbar: {
    type: Boolean,
    default: false
  },
  maskClick: {
    type: Boolean,
    default: false
  },
  rowNumber: {
    type: Number,
    default: 5
  },
  appendToBody: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'change'])

const state = reactive({
  column1: [],
  column2: [],
  column3: [],
  column4: [],
  dIndex1: 0,
  dIndex2: 0,
  dIndex3: 0,
  dIndex4: 0,
  indexArr: [],
  result: [],
  prevBodyCss: ''
})
const picker = ref(null)

const getRowNumber = computed(() => {
  if (props.rowNumber < 3) {
    return 3
  }
  return props.rowNumber % 2 === 0 ? props.rowNumber + 1 : props.rowNumber
})

const boxHeight = computed(() => {
  let itemHeight = parseInt(props.itemHeight)
  itemHeight = itemHeight ? itemHeight : DEFTAULT_ITEM_HEIGHT
  return itemHeight * getRowNumber.value
})


const maskStyle = computed(() => {
  let style = { backgroundSize: '100% 88px' }
  if (getRowNumber.value === 3) {
    style = { backgroundSize: '100% 44px' }
  }
  return style
})

const clickMask = () => {
  if (props.maskClick) {
    looseBody()
    emit('update:visible', false)
  }
}

const formateData = () => {
  if (props.layer > 1) {
    setLinkColumn()
  } else {
    state.column1 = props.data[0] || []
    state.column2 = props.data[1] || []
    state.column3 = props.data[2] || []
    state.column4 = props.data[3] || []
    setNormalIndex()
  }
}

const setLinkColumn = () => {
  if (props.layer === 2) {
    setLinkLayer2()
  } else if (props.layer === 3) {
    setLinkLayer2()
    setLinkLayer3()
  } else if (props.layer === 4) {
    setLinkLayer2()
    setLinkLayer3()
    setLinkLayer4()
  }
}

const setLinkLayer2 = () => {
  const { defaultIndex } = props
  state.column1 = props.data || []
  if (typeof defaultIndex === 'number') {
    state.dIndex1 = defaultIndex
    state.dIndex2 = 0
    if (props.data.length > 1 && props.data[0].children) {
      state.column2 = props.data[0].children || []
    }
  } else if (Array.isArray(defaultIndex) && defaultIndex.length > 0) {
    state.dIndex1 = defaultIndex[0] || 0
    state.column2 = props.data[state.dIndex1].children || []
    nextTick(() => {
      if (state.column2.length - 1 < defaultIndex[1]) {
        state.dIndex2 = state.column2.length - 1
      } else {
        state.dIndex2 = defaultIndex[1] || 0
      }
    })
  }
}

const setLinkLayer3 = () => {
  const { defaultIndex } = props
  if (typeof defaultIndex === 'number') {
    state.dIndex3 = 0
    if (state.column2.length > 1 && state.column2[0].children) {
      state.column3 = state.column2[0].children || []
    }
  } else if (Array.isArray(defaultIndex) && defaultIndex.length > 1) {
    nextTick(() => {
      state.column3 = state.column2[state.dIndex2].children || []
      nextTick(() => {
        if (state.column3.length - 1 < defaultIndex[2]) {
          state.dIndex3 = state.column3.length - 1
        } else {
          state.dIndex3 = defaultIndex[2] || 0
        }
      })
    })
  }
}

const setLinkLayer4 = () => {
  const { defaultIndex } = props
  if (typeof defaultIndex === 'number') {
    state.dIndex4 = 0
    if (state.column3.length > 1 && state.column3[0].children) {
      state.column4 = state.column3[0].children || []
    }
  } else if (Array.isArray(defaultIndex) && defaultIndex.length > 2) {
    setTimeout(() => {
      state.column4 = state.column3[state.dIndex3].children || []
      nextTick(() => {
        if (state.column4.length - 1 < defaultIndex[3]) {
          state.dIndex4 = state.column4.length - 1
        } else {
          state.dIndex4 = defaultIndex[3] || 0
        }
      })
    })
  }
}

const setNormalIndex = () => {
  nextTick(() => {
    const { defaultIndex } = props
    if (Array.isArray(defaultIndex)) {
      setDefaultIndex()
    } else {
      state.dIndex1 = Number(defaultIndex) || 0
    }
  })
}

const setDefaultIndex = () => {
  const { indexArr } = state
  function next() {
    let promise = Promise.resolve()
    let index = 0
    while (index < props.data.length) {
      promise = promise.then(indexArr[index])
      index++
    }
  }
  next()
}

const change = (index, res) => {
  state.result[index] = res
  emit('change', state.result)
}

const change1 = (res) => {
  if (res) {
    change(0, res)
    if (props.layer > 1) {
      state.dIndex2 = 0
      changeLink('column2', res)
    }
  }
}
const change2 = (res) => {
  if (res) {
    change(1, res)
    if (props.layer > 2) {
      state.dIndex3 = 0
      changeLink('column3', res)
    }
  }
}

const change3 = (res) => {
  if (res) {
    change(2, res)
    if (props.layer > 3) {
      state.dIndex4 = 0
      changeLink('column4', res)
    }
  }
}

const change4 = (res) => {
  if (res) {
    change(3, res)
  }
}

const changeLink = (key, res) => {
  if (props.layer) {
    setTimeout(() => {
      state[key] = res.children || []
    }, 1000 / 60)
  }
}

const cancel = () => {
  looseBody()
  emit('cancel')
  emit('update:visible', false)
}

const confirm = () => {
  looseBody()
  emit('confirm', state.result)
  emit('update:visible', false)
}

const stopPropagation = (e) => {
  e.stopPropagation()
}

const fixedBody = () => {
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  state.prevBodyCss = document.body.style.cssText
  document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
}

const looseBody = () => {
  const body = document.body
  const top = body.style.top
  body.style.cssText = state.prevBodyCss
  body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
  body.style.top = ''
}



const init = () => {
  state.result = []
  state.indexArr = [
    () => state.dIndex1 = props.defaultIndex[0] || 0,
    () => state.dIndex2 = props.defaultIndex[1] || 0,
    () => state.dIndex3 = props.defaultIndex[2] || 0,
    () => state.dIndex4 = props.defaultIndex[3] || 0
  ]
  formateData()
}

onBeforeMount(() => {
  init()
})

onBeforeUnmount(() => {
  picker.value.removeEventListener('click', stopPropagation)
})


onMounted(() => {
  picker.value.addEventListener('click', stopPropagation)
  if (props.appendToBody) {
    // document.body.appendChild(this.$el)
  }
})

watch(() => props.visible, (v) => {
  if (v) {
    fixedBody()
  }
})

watch(() => props.defaultIndex, () => {
  init()
})

watch(() => props.data, () => {
  init()
})


</script>
<style lang="scss" scoped>
.pickerbox {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toup-enter-active,
.toup-leave-active {
  transition: transform .3s;
}

.toup-enter,
.toup-leave-to {
  transform: translate3d(0, 100px, 0);
}

// ----
.vue-picker {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  user-select: none;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  display: block;
}

.content {
  overflow: hidden;
  height: 220px;
  position: relative;
  display: flex;
}

.colums {
  display: flex;
  overflow: hidden;
  font-size: 16px;
  text-align: center;
  flex: 1;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4)), linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
  background-repeat: no-repeat;
  background-position: top, bottom;
  backface-visibility: hidden;
  pointer-events: none;
  background-size: 100% 88px;
}

.hairline {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 3;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
  height: 44px;

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    border: 0 solid #E3E4E8;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    border-width: 1.5px 0;
    margin:0 34px
  }
}
</style>