<template>
  <div class="list" ref="list">
    <ul :style="state.ulStyle">
      <li v-for="(item, index) in props.column" :key="'item' + index" >{{ item.text }}</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { getClient, START_EVENT, MOVE_EVENT, END_EVENT,isPC } from './utils'

const DEFAULT_DURATION = 200
const LIMIT_TIME = 300
const LIMIT_DISTANCE = 15
const IS_PC = isPC()


const props = defineProps({
  defaultIndex: {
    type: Number,
    default: 0
  },
  column: {
    type: Array,
    default: () => ([])
  },
  boxHeight: Number,
  itemHeight: Number,
  rowNumber: Number
})

const  emit = defineEmits(['change'])

const state = reactive({
  ulStyle: {
    transform: `translate3d(0px, 0px, 0px)`,
    transitionDuration: `0ms`,
    transitionProperty: `none`,
    lineHeight: `${props.itemHeight}px`
  },
  bottom: 0,
  top: 0,
  startTop: 0,
  selectIndex: 0,
  touchStartTime: 0,
  startY: 0,
  momentumTop: 0,
  disY: 0,
})

let wheelTimer = null;

const list = ref(null)

const count = computed(() => {
  return props.column.length
})

const getRoNumber = computed(() => {
  return Math.floor(props.rowNumber / 2)
})

const init = () => {
  setTop(props.defaultIndex)
  const halfBox = (props.boxHeight - props.itemHeight) / 2
  state.bottom = halfBox + props.itemHeight
  state.top = halfBox - count.value * props.itemHeight
}

const setTop = (index = 0) => {
  const { boxHeight, itemHeight } = props;
  state.startTop = ((boxHeight - itemHeight) / 2) - (index * itemHeight)
  state.ulStyle.transform = `translate3d(0px, ${state.startTop}px, 0px)`
  state.selectIndex = index
  change()
}

const handleStart = (e) => {
  state.touchStartTime = Date.now()
  // ----
  state.startY = getClient(e).y
  state.momentumTop = state.startTop

  state.ulStyle.transitionDuration = `0ms`
  state.ulStyle.transitionProperty = `none`
  if (IS_PC) {
    document.addEventListener(MOVE_EVENT, handleMove, false)
    document.addEventListener(END_EVENT, handleEnd, false)
  }
}


const handleMove = (e) => {
  e.preventDefault()
  e.stopPropagation()
  state.disY = getClient(e).y - state.startY
  state.startY = getClient(e).y
  if (state.startTop >= state.bottom) {
    state.startTop = state.bottom
  } else if (state.startTop <= state.top) {
    state.startTop = state.top
  } else {
    state.startTop += state.disY
  }
  state.ulStyle.transform = `translate3d(0px, ${state.startTop}px, 0px)`
  const now = Date.now()

  if (now - state.touchStartTime > LIMIT_TIME) {
    state.touchStartTime = now
    state.momentumTop = state.startTop
  }
}

const handleEnd = () => {
  if (IS_PC) {
    document.removeEventListener(MOVE_EVENT, handleMove, false)
    document.removeEventListener(END_EVENT, handleEnd, false)
  }
  const distance = state.startTop - state.momentumTop
  const duration = Date.now() - state.touchStartTime
  const allowMomentum = duration < LIMIT_TIME && Math.abs(distance) > LIMIT_DISTANCE
  if (allowMomentum) {
    toMove(distance, duration)
  } else {
    setTranfromTop()
  }
}

const setTranfromTop = () => {
  state.ulStyle.transitionProperty = `all`
  state.ulStyle.transitionDuration = `${DEFAULT_DURATION}ms`
  if (state.startTop >= state.bottom - props.itemHeight) {
    setTop()
  } else if (state.startTop <= state.top + props.itemHeight) {
    setTop(count.value - 1)
  } else {
    let index = Math.round((state.startTop) / props.itemHeight)
    state.startTop = index * props.itemHeight
    if (state.startTop > state.bottom) {
      state.startTop = state.bottom - props.itemHeight
      index = -getRoNumber.value
    } else if (state.startTop < state.top) {
      state.startTop = state.top + props.itemHeight
      index = count.value + 1
    }
    state.ulStyle.transform = `translate3d(0px, ${state.startTop}px, 0px)`
    index = getRoNumber.value - index
    if (state.selectIndex !== index) {
      state.selectIndex = index
      change()
    }
  }
}

const toMove = (distance, duration) => {
  const speed = Math.abs(distance / duration)
  distance = state.startTop + (speed / 0.002) * (distance < 0 ? -1 : 1)
  state.ulStyle.transitionProperty = `all`
  state.ulStyle.transitionDuration = `1000ms`
  setTop(Math.min(Math.max(Math.round(-distance / props.itemHeight), 0), count.value - 1))
}

const change = () => {
  emit('change', props.column[state.selectIndex])
}

const mousewheel = (e) => {
  e.preventDefault()
  e.stopPropagation()
  state.ulStyle.transitionDuration = `0ms`
  state.ulStyle.transitionProperty = `none`
  const { deltaX, deltaY } = e
  if (Math.abs(deltaX) < Math.abs(deltaY)) {
    state.startTop = state.startTop - deltaY
    let b = state.bottom - props.itemHeight
    let t = state.top + props.itemHeight
    let shouldMove = true
    if (state.startTop > b) {
      state.startTop = b
      shouldMove = false
    } else if (state.startTop < t) {
      state.startTop = t
      shouldMove = false
    }
    state.ulStyle.transform = `translate3d(0px, ${state.startTop}px, 0px)`
    if (shouldMove) {
      clearInterval(wheelTimer)
      wheelTimer = setTimeout(setTranfromTop, 100)
    }
  }
}

onMounted(() => {
  init();
  list.value.addEventListener(START_EVENT, handleStart, false)
  if (IS_PC) {
    list.value.addEventListener('wheel', mousewheel, false)
  } else {
    list.value.addEventListener(MOVE_EVENT, handleMove, false)
    list.value.addEventListener(END_EVENT, handleEnd, false)
  }
})

onBeforeUnmount(() => {
  list.value.removeEventListener(START_EVENT, handleStart, false)
  if (IS_PC) {
    list.value.removeEventListener('wheel', mousewheel, false)
    list.value.removeEventListener(MOVE_EVENT, handleMove, false)
    list.value.removeEventListener(END_EVENT, handleEnd, false)
  }
})

watch(() => props.column, () => {
  init()
})

watch(() => props.defaultIndex, () => {
  setTop(props.defaultIndex)
})


</script>

<style lang="scss" scoped>
.list {
  margin: 0;
  padding: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;

  ul {
    margin: 0;
    padding: 0;
    transition-timing-function: cubic-bezier(0.23, 1, 0.68, 1);
    line-height: 44px;
  }

  li {
    margin: 0;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
  }
}
</style>