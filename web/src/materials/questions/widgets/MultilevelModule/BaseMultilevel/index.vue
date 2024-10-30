<template>
  <div class="multilevel-wrapper">
    <div class="multilevel-wrapper-mobile" v-if="isMobile">
      <div v-for="(v, i) in valList" :key="v+i" class="multilevel-select-item">
        <template v-if="i == 0">
          <div :class="`select-input ${i==pickIndex ? 'border-active' : ''}`" @click="showPickPop(props.multilevelData.children,i)">
            <div class="select-input-left">
                <div v-if="valList[i]" class="select-input-active">{{ valList[i].text }}</div>
                <div v-else class="select-input-placeholder">{{ placeholderList[i].text }}</div>
            </div>
            <div class="select-input-right"><i-ep-ArrowDown class="arrow-down-icon"/></div>
          </div>
        </template>
        <template v-else>
          <div v-if="valList[i - 1] && valList[i - 1]?.children?.length > 0">
            <div :class="`select-input ${i==pickIndex ? 'border-active' : ''}`" @click="showPickPop(valList[i - 1].children,i)">
              <div class="select-input-left">
                <div v-if="valList[i]" class="select-input-active">{{ valList[i].text }}</div>
                <div v-else class="select-input-placeholder">{{ placeholderList[i].text }}</div>
              </div>
              <div class="select-input-right"><i-ep-ArrowDown class="arrow-down-icon"/></div>
            </div>
          </div>
        </template>
      </div>
      <Picker :data="listPop"
      :showToolbar="true"  v-model:visible="pickPop" @confirm="onConfirm" @cancel="onCancel" />
    </div>
    <div v-else class="multilevel-wrapper-pc">
      <div v-for="(v, i) in valList" :key="v+i" class="multilevel-select-item">
        <template v-if="i == 0">
          <div v-if="props.readonly" class="multilevel-mask"></div>
          <el-select v-model="valList[i]"  @change="(data)=>handleChange(data,i)" :placeholder="placeholderList[i].text" size="large" value-key="hash"
            style="width: 194px">
            <el-option  v-for="item in props.multilevelData.children" :key="item.hash" :label="item.text"
              :value="item" />
          </el-select>
        </template>
        <template v-else>
          <div v-if="valList[i - 1] && valList[i - 1]?.children?.length > 0">
            <el-select v-model="valList[i]" @change="(data)=>handleChange(data,i)" :placeholder="placeholderList[i].text" size="large" value-key="hash"
              style="width: 194px">
              <el-option v-for="item in valList[i - 1].children" :key="item.hash" :label="item.text" :value="item" />
            </el-select>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import Picker from '@/management/pages/edit/components/Picker/index.vue'
import { isMobile as isInMobile } from '@/render/utils/index'
const props = defineProps({
  multilevelData: {
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

const valList = ref([]);
const pickPop = ref(false)
const listPop = ref([])
const pickIndex = ref(-1)
const isMobile = isInMobile()

const placeholderList = computed(() => {
  return props.multilevelData.placeholder
})


const resetValList = (index) => {
  for (let i = valList.value.length-1; index < i; i--) {
      valList.value[i] = null;
    }
}

const handleChange = async(val,i) => {
  await nextTick()
  resetValList(i)
   if (val?.children?.length == 0) {
    const hashList = [];
    valList.value.map(v => {
      if (v) {
        hashList.push(v.hash)
      }
    })
    emit('change',hashList.join(','))
  } else {
    if (props.value) {
      emit('change','')
   }
  }
}

const onConfirm = (val) => {
  valList.value[pickIndex.value] = val[0];
  handleChange(val[0], pickIndex.value);
  pickIndex.value=-1
}
const onCancel = () => {
  pickIndex.value=-1
}

const showPickPop = (list, index) => {
  pickPop.value = true;
  listPop.value = [list];
  pickIndex.value = index
}

onMounted(() => {
  placeholderList.value.map(() => {
    valList.value.push(null)
  })
})


</script>
<style lang="scss" scoped>
.multilevel-wrapper {
  .multilevel-mask{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  &-pc {
    display: flex;
    .multilevel-select-item{
      margin-right: 8px;
      position: relative;
    }
  }
  &-mobile {
    .multilevel-select-item{
      margin-bottom: 8px;
    }
  }
  .select-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:100%;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid rgba(227,228,232,1);
    border-radius: 2px;
    padding: 9px 12px;
    &-placeholder{
      font-size: 14px;
      color: #C8C9CD;
    }
    &-active{
      font-size: 14px;
      color: #4A4C5B;
    }
    &:active{
      // background: #F6F7F9;
      border-color: $primary-color;
    }
    &.border-active{
      border-color: $primary-color;
    }
    .arrow-down-icon{
      color:#C8C9CD;
    }
  }
}
</style>