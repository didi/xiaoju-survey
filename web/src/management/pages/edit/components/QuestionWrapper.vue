<template>
  <div
    :class="[itemClass, { 'is-move': isSelected || isMove }]"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @click="clickFormItem"
  >
    <div><slot v-if="moduleConfig.type !== 'section'"></slot></div>

    <div :class="[showHover ? 'visibility' : 'hidden', 'hoverItem']">
      <div
        class="item el-icon-rank"
        @click.stop.prevent
        @mouseenter="setMoveState(true)"
        @mouseleave="setMoveState(false)"
      >
        <i-ep-rank />
      </div>
      <div v-if="showUp" class="item" @click.stop.prevent="onMoveUp">
        <i-ep-top />
      </div>
      <div v-if="showDown" class="item" @click.stop.prevent="onMoveDown">
        <i-ep-bottom />
      </div>
      <div v-if="showCopy" class="item" @click.stop.prevent="onCopy">
        <i-ep-copyDocument />
      </div>
      <div class="item" @click.stop.prevent="onDelete">
        <i-ep-close />
      </div>
    </div>
    <div class="logic-text showText" v-html="getShowLogicText"></div>
    <div class="logic-text jumpText" v-html="getJumpLogicText"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message-box.scss'
import { useShowLogicInfo } from '@/management/hooks/useShowLogicInfo'
import { useJumpLogicInfo } from '@/management/hooks/useJumpLogicInfo'

const props = defineProps({
  qIndex: {
    type: Number,
    default: 0
  },
  indexNumber: {
    type: Number,
    default: 1
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  },
  moduleConfig: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['changeSeq', 'select'])

const { getShowLogicText, hasShowLogic } = useShowLogicInfo(props.moduleConfig.field)
const { getJumpLogicText, hasJumpLogic } = useJumpLogicInfo(props.moduleConfig.field)

const isHover = ref(false)
const isMove = ref(false)

const itemClass = computed(() => {
  return {
    'question-wrapper': true,
    'mouse-hover': isHover.value,
    isSelected: props.isSelected,
    spliter: props.moduleConfig.showSpliter
  }
})
const showHover = computed(() => {
  return isHover.value || props.isSelected
})
const showUp = computed(() => {
  return !props.isFirst
})
const showDown = computed(() => {
  return !props.isLast
})
const showCopy = computed(() => {
  const field = props.moduleConfig.field
  const hiddenCopFields = ['mob', 'mobileHidden', 'userAgreement']
  return hiddenCopFields.indexOf(field) <= -1
})

const clickFormItem = () => {
  const index = props.qIndex

  if (!props.isSelected) {
    emit('select', index)
  }
}
const onCopy = () => {
  const index = props.qIndex
  emit('changeSeq', { type: 'copy', index })
  isHover.value = false

  return false
}
const onMoveUp = () => {
  const index = props.qIndex

  emit('changeSeq', { type: 'move', index, range: -1 })
  isHover.value = false

  if (props.isSelected) {
    emit('select', index - 1)
  }
}

const onMouseenter = () => {
  isHover.value = true
}
const onMouseleave = () => {
  isHover.value = false
}
const onMoveDown = () => {
  const index = props.qIndex

  emit('changeSeq', { type: 'move', index, range: 1 })
  isHover.value = false

  if (props.isSelected) {
    emit('select', index + 1)
  }
}
const onDelete = async () => {
  if (unref(hasShowLogic) || getShowLogicText.value) {
    ElMessageBox.alert('该题目被显示逻辑关联，请先清除逻辑依赖', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }
  if (unref(hasJumpLogic)) {
    ElMessageBox.alert('该题目被跳转逻辑关联，请先清除逻辑依赖', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }
  try {
    await ElMessageBox.confirm('本次操作会影响数据统计查看，是否确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    if (props.isSelected && props.isLast) {
      emit('select', null)
    }

    const index = props.qIndex
    emit('changeSeq', { type: 'delete', index })
    isHover.value = false
  } catch (error) {
    console.log('取消删除')
  }
}

const setMoveState = (state: boolean) => {
  isMove.value = state
}
</script>

<style lang="scss" scoped>
.question-wrapper {
  position: relative;
  padding: 0.36rem 0 0.36rem;
  border: 1px solid transparent;
  &.spliter {
    border-bottom: 0.1rem solid $spliter-color;
  }

  &.mouse-hover {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.09);
  }
  &.isSelected {
    background-color: #f2f4f7;
    box-shadow: 0 0 5px #e3e4e8;
  }

  .hoverItem {
    position: absolute;
    top: 0;
    margin-top: -5px;
    right: -32px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    &.hidden {
      display: none;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 5px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eceff1;
      margin-right: 2px;
      cursor: pointer;
      color: #506b7b;
      font-size: 12px;
      text-align: center;
      line-height: 28px;
      &:hover {
        background-color: $primary-color;
        color: #fff;
      }
    }
  }
  .logic-text {
    font-size: 12px;
    color: #c8c9cd;
    padding: 0 0.4rem;
    line-height: 26px;
  }
}
</style>
