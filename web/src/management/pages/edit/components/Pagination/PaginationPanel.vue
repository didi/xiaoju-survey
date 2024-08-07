<template>
  <div v-if="props.totalPage > 0" class="com-pagination">
    <span :class="['com-pagination-item', prev_class]" @click="changePage(prev_page)">
      <i-ep-ArrowLeft />
    </span>
    <template v-if="!is_more_filled">
      <div
        v-for="i in firstPagination"
        :key="i"
        :class="['com-pagination-item', `page-${i}`, now_page == i ? 'current' : '']"
        @click="changePage(i)"
      >
        <span>{{ i }}</span>
        <div v-if="!props.readonly" :class="['moreControls']" @click.stop="showTooltipVisible(i)">
          <i-ep-MoreFilled />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="i in more_filled_arr.startArr"
        @click="changePage(i)"
        :key="i"
        :class="['com-pagination-item', ` page-${i}`, now_page == i ? 'current' : '']"
      >
        <span>{{ i }}</span>
        <div v-if="!props.readonly" :class="['moreControls']" @click.stop="showTooltipVisible(i)">
          <i-ep-MoreFilled />
        </div>
      </div>
      <el-tooltip class="controls-wrap" effect="light" placement="bottom" :visible="moreVisible">
        <span class="com-pagination-item" @click.stop="moreVisible = true">
          <i-ep-MoreFilled />
        </span>
        <template #content>
          <div class="bubble-wrap">
            <div
              class="bubble-item"
              v-for="i in more_filled_arr.bubbleArr"
              :key="i"
              @click="changePage(i)"
            >
              <span>{{ i }}</span>
            </div>
          </div>
        </template>
      </el-tooltip>
      <div
        v-for="i in more_filled_arr.endArr"
        :key="i"
        :class="['com-pagination-item', `page-${i}`, now_page == i ? 'current' : '']"
        @click="changePage(i)"
      >
        <span>{{ i }}</span>
        <div v-if="!props.readonly" :class="['moreControls']" @click.stop="showTooltipVisible(i)">
          <i-ep-MoreFilled />
        </div>
      </div>
    </template>
    <span :class="['com-pagination-item', next_class]" @click="changePage(next_page)">
      <i-ep-ArrowRight />
    </span>
    <el-tooltip
      v-if="slot.tooltip && props.readonly == false"
      :visible="tooltipVisible"
      :popper-options="{
        modifiers: [
          {
            name: 'computeStyles',
            options: {
              adaptive: false,
              enabled: false
            }
          }
        ]
      }"
      :virtual-ref="triggerBtn"
      virtual-triggering
      effect="light"
      popper-class="singleton-tooltip"
    >
      <template #content>
        <slot name="tooltip" :index="tooltipIndex"></slot>
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { clone } from 'lodash-es'
import { reactive, computed, watch, ref, onMounted, onUnmounted, nextTick, useSlots } from 'vue'

interface Props {
  modelValue: number // 页码
  totalPage?: number
  intervalCount?: number
  readonly?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  totalPage: 1,
  intervalCount: 8,
  readonly: false
})
const emit = defineEmits(['change-page', 'update:modelValue'])

const state = reactive({
  now: props.modelValue,
  jump: ''
})

const slot = useSlots()

const moreVisible = ref(false)
const tooltipVisible = ref(false)
const triggerBtn = ref<EventTarget | null>(null)
const tooltipIndex = ref(0)

const now_page = computed(() => {
  return state.now * 1
})
const prev_class = computed(() => {
  return now_page.value == 1 ? 'disabled' : ''
})
const next_class = computed(() => {
  return now_page.value == props.totalPage ? 'disabled' : ''
})
const prev_page = computed(() => {
  return now_page.value > 1 ? now_page.value - 1 : 1
})

const next_page = computed(() => {
  return now_page.value < props.totalPage ? now_page.value + 1 : props.totalPage
})

const is_more_filled = computed(() => {
  const intervalNum = props.totalPage - now_page.value + 1
  if (intervalNum >= props.intervalCount + 1) {
    return true
  }
  return false
})

const totalArr = computed(() => {
  const arr = []
  for (let i = 0; i < props.totalPage; i++) {
    arr.push(i + 1)
  }
  return arr
})

const more_filled_arr = computed(() => {
  let startArr = []
  let bubbleArr = []
  let endArr = []
  const arr = clone(totalArr.value)
  const intervalNum = Math.round(props.intervalCount / 2)
  startArr = arr.slice(now_page.value - 1, intervalNum + now_page.value - 1)
  endArr = arr.slice(intervalNum * -1)
  bubbleArr = arr.slice(startArr[startArr.length - 1], endArr[0] - 1)
  return {
    startArr,
    bubbleArr,
    endArr
  }
})

const firstPagination = computed(() => {
  const arr = clone(totalArr.value)
  return arr.splice(props.intervalCount * -1)
})

const changePage = (page: number) => {
  state.now = page
  emit('update:modelValue', state.now)
  emit('change-page', state.now)
}

const showTooltipVisible = (index: number) => {
  if (slot.tooltip) {
    nextTick(() => {
      tooltipIndex.value = index
      triggerBtn.value = document.getElementsByClassName(`page-${index}`)[0] || null
      tooltipVisible.value = true
    })
  }
}

const hideMoreVisible = () => {
  moreVisible.value = false
}

const hideTooltipVisible = () => {
  tooltipVisible.value = false
}

onMounted(() => {
  document.addEventListener('click', hideMoreVisible)
  if (slot.tooltip) {
    document.addEventListener('click', hideTooltipVisible)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', hideMoreVisible)
  if (slot.tooltip) {
    document.removeEventListener('click', hideTooltipVisible)
  }
})

watch(
  () => props.modelValue,
  () => {
    state.now = props.modelValue
  }
)
</script>
<style lang="scss" scoped>
.bubble-wrap {
  .bubble-item {
    max-width: 100px;
    min-width: 10px;
    text-align: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;

    &:hover {
      background-color: #cccc;
    }
  }
}

.com-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0;
  user-select: none;
  .moreControls {
    color: #6e707c;
    display: none;

    position: absolute;
    left: 22px;
    svg {
      transform: rotate(90deg);
      font-size: 10px;
    }
  }
  &-item {
    display: inline-block;
    position: relative;
    // padding: 0 4px;
    min-width: 32px;
    height: 32px;
    color: #303133;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: $primary-color;
      .moreControls {
        display: block;
      }
    }

    &.active {
      color: $primary-color;
      .moreControls {
        display: block;
      }
    }

    svg {
      display: block;
      font-size: 12px;
      font-weight: bold;
      width: inherit;
      cursor: pointer;

      &:hover {
        color: $primary-color;
      }
    }
  }

  .disabled,
  .disabled:hover {
    svg {
      cursor: not-allowed;
      color: #303133 !important;
    }
  }

  .current,
  .current:hover {
    color: $primary-color;
  }
}
</style>
