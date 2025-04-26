<template>
  <div class="cascader-wrapper">
    <div class="cascader-wrapper-mobile" v-if="isMobile">
      <div v-for="(v, i) in valList" :key="v + i" class="cascader-select-item">
        <template v-if="i == 0">
          <div
            :class="`select-input ${i == pickIndex ? 'border-active' : ''}`"
            @click="showPickPop(props.cascaderData.children, i)"
          >
            <div class="select-input-left">
              <div v-if="valList[i]" class="select-input-active">{{ valList[i].text }}</div>
              <div v-else class="select-input-placeholder">{{ placeholderList[i].text }}</div>
            </div>
            <div class="select-input-right"><i-ep-ArrowDown class="arrow-down-icon" /></div>
          </div>
        </template>
        <template v-else>
          <div v-if="valList[i - 1] && valList[i - 1]?.children?.length > 0">
            <div
              :class="`select-input ${i == pickIndex ? 'border-active' : ''}`"
              @click="showPickPop(valList[i - 1].children, i)"
            >
              <div class="select-input-left">
                <div v-if="valList[i]" class="select-input-active">{{ valList[i].text }}</div>
                <div v-else class="select-input-placeholder">{{ placeholderList[i].text }}</div>
              </div>
              <div class="select-input-right"><i-ep-ArrowDown class="arrow-down-icon" /></div>
            </div>
          </div>
        </template>
      </div>
      <Picker
        :list="listPop"
        :showToolbar="true"
        v-model="pickPop"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </div>
    <div v-else class="cascader-wrapper-pc">
      <div v-for="(v, i) in valList" :key="v + i" class="cascader-select-item">
        <template v-if="i == 0">
          <div v-if="props.readonly" class="cascader-mask"></div>
          <el-select
            v-model="valList[i]"
            @change="(data) => handleChange(data, i)"
            :placeholder="placeholderList[i].text"
            size="large"
            value-key="hash"
            style="width: 194px"
          >
            <el-option
              v-for="item in props.cascaderData.children"
              :key="item.hash"
              :label="item.text"
              :value="item"
            />
          </el-select>
        </template>
        <template v-else>
          <div v-if="valList[i - 1] && valList[i - 1]?.children?.length > 0">
            <el-select
              v-model="valList[i]"
              @change="(data) => handleChange(data, i)"
              :placeholder="placeholderList[i].text"
              size="large"
              value-key="hash"
              style="width: 194px"
            >
              <el-option
                v-for="item in valList[i - 1].children"
                :key="item.hash"
                :label="item.text"
                :value="item"
              />
            </el-select>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted, computed, onBeforeUnmount } from 'vue'
import Picker from '@/management/pages/edit/components/Picker/index.vue'
import { isMobile as isInMobile } from '@/render/utils/index'
const props = defineProps({
  cascaderData: {
    type: Object,
    default: () => ({})
  },
  value: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['change'])

const valList = ref([])
const pickPop = ref(false)
const listPop = ref([])
const pickIndex = ref(-1)
const isMobile = ref(isInMobile())

const placeholderList = computed(() => {
  return props.cascaderData.placeholder
})

const resetValList = (index) => {
  for (let i = valList.value.length - 1; index < i; i--) {
    valList.value[i] = null
  }
}

const handleChange = async (val, i) => {
  await nextTick()
  resetValList(i)
  if (val?.children?.length == 0) {
    const hashList = []
    valList.value.map((v) => {
      if (v) {
        hashList.push(v.hash)
      }
    })
    emit('change', hashList.join(','))
  } else {
    if (props.value) {
      emit('change', '')
    }
  }
}

const onConfirm = (val) => {
  valList.value[pickIndex.value] = val
  handleChange(val, pickIndex.value)
  pickIndex.value = -1
}
const onCancel = () => {
  pickIndex.value = -1
}

const showPickPop = (list, index) => {
  pickPop.value = true
  listPop.value = list
  pickIndex.value = index
}

const updateEquipment = () => {
  isMobile.value = isInMobile()
  pickPop.value = false
}

onMounted(() => {
  window.addEventListener('resize', updateEquipment)
  placeholderList.value.map(() => {
    valList.value.push(null)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateEquipment)
})
</script>
<style lang="scss" scoped>
.cascader-wrapper {
  .cascader-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  &-pc {
    display: flex;
    .cascader-select-item {
      margin-right: 8px;
      position: relative;
    }
  }
  &-mobile {
    .cascader-select-item {
      margin-bottom: 8px;
    }
  }
  .select-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #ffffff;
    border: 1px solid rgba(227, 228, 232, 1);
    border-radius: 2px;
    padding: 9px 12px;
    &-placeholder {
      font-size: 14px;
      color: #c8c9cd;
    }
    &-active {
      font-size: 14px;
      color: #4a4c5b;
    }
    &:active {
      // background: #F6F7F9;
      border-color: $primary-color;
    }
    &.border-active {
      border-color: $primary-color;
    }
    .arrow-down-icon {
      color: #c8c9cd;
    }
  }
}
</style>
