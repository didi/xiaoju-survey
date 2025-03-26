<template>
  <div class="channel-cards">
    <div class="channel-card" v-for="(item, index) in data" :key="index" @click="(e) => handleClick(e, item)">
      <div class="header">
        <div class="title">
          <!-- <el-icon>
            <component :is="CHANNEL_TYPE_ICON[item]" />
          </el-icon> -->
          <i :class="['iconfont channel_icon',CHANNEL_TYPE_ICON[item as CHANNEL_TYPE] ] "></i>
          <span class="name">{{ CHANNEL_TYPE_TEXT[item] }}</span>
        </div>
        <span class="intro" v-if="item == CHANNEL_TYPE.INJECT_APP" @click="handleIntroOpen">
          接入说明 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <div class="content">
        <div class="desc">{{ CHANNEL_TYPE_DSEC[item] }}</div>
      </div>
    </div>
  </div>
  <ChannelModify :visible="dialogVisible" @confirm="handleConfirm" @close="handleClose"/>
  <el-dialog
    v-model="introVisible"
    width="800"
    :before-close="handleIntroClose"
  >
  <template #title>
      <div class="channel-dialog-title">
        SDK接入方式
      </div>
    </template>
    <CodeBlock :surveyPath="getSurveyPath" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleIntroClose">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>   
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { CHANNEL_TYPE_ICON, CHANNEL_TYPE, CHANNEL_TYPE_TEXT } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'
import { ElMessageBox } from 'element-plus'
import CodeBlock from './CodeBlock.vue'
import { Link, Aim } from '@element-plus/icons-vue'
import ChannelModify from './ChannelModify.vue'
import { useEditStore } from '@/management/stores/edit' 
import { storeToRefs  } from 'pinia'

// import { CHANNEL_TYPE_ICON, CHANNEL_TYPE, CHANNEL_STATUS_TEXT, CHANNEL_STATUS, type IDeliverDataItem } from '@/management/enums/channel'

const editStore = useEditStore()
const { surveyId, schema } = storeToRefs(editStore)
const channelStore = useChannelStore()
const CHANNEL_TYPE_DSEC = {
  [CHANNEL_TYPE.SHORT_LINK]: '方式描述方式描述方式描述方式描述方式描述方式描述方式描述方式描述',
  [CHANNEL_TYPE.INJECT_WEB]: "将问卷通过SDK方式嵌入到网页中，适合弹窗、信息流等。",
  [CHANNEL_TYPE.INJECT_APP]: "将问卷通过SDK方式嵌入到IOS、Android等应用中。",
  [CHANNEL_TYPE.INJECT_MP]: "将问卷通过SDK嵌入到小程序中，在小程序中进行调查收集。",
}

const data = [
  CHANNEL_TYPE.INJECT_APP,
  // CHANNEL_TYPE.SHORT_LINK,
  CHANNEL_TYPE.INJECT_WEB,
  
  CHANNEL_TYPE.INJECT_MP
]
const dialogVisible = ref(false)
const curType = ref('')
const getSurveyPath = computed(() => {
  return (schema.value?.metaData as any).surveyPath || ''
})
const handleClick = (e: any, type: CHANNEL_TYPE) => {
  e.stopPropagation()
  e.preventDefault()
  curType.value = type
  switch (type) {
    case CHANNEL_TYPE.INJECT_APP:
      dialogVisible.value = true
      break;
    default:
      ElMessageBox.alert(`${CHANNEL_TYPE_TEXT[type]}方式即将上线，敬请期待`, '提示')
      break;
  }
}
const handleConfirm = async (name: string) => {
  await channelStore.createChannel({
    name,
    surveyId: surveyId.value,
    type: curType.value
  })
  dialogVisible.value = false
}
const handleClose = () => {
  dialogVisible.value = false
}
let introVisible = ref(false)
const handleIntroOpen = (e: any) => {
  e.stopPropagation()
  e.preventDefault()
  introVisible.value = true
}
const handleIntroClose = () => {
  introVisible.value = false
}
</script> 
<style lang="scss" scoped>
.channel-cards {
  // width:  100%;
  display: flex;

  .channel-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 20px 20px 0;
    background: #fff;
    border: 1px solid rgba(227,228,232,1);
    border-radius: 4px;
    overflow: hidden;
    
    cursor: pointer;
    transition: all .3s;
    
    .header{
      display: flex;
      height: 46px;
      padding: 0 12px;
      justify-content: space-between;
      align-items: center;
      line-height: 24px;
      background: #f6f7f9;
      .intro {
        font-size: 12px;
        // &:hover{
          color: #FAA600;
        // }
      }
      .name{
        font-size: 16px;
        color: #2d2e33;
      }
    }
    .content{
      padding: 12px;
      flex: 1;
      color: #6E707C;
      &:hover {
        background:#fff;
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    .channel_icon {
      font-size: 20px;
      margin-right: 8px;
      color: #92949D;
    }
  }
}
</style>
<style>
  .channel-dialog-title {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #292A36;
    letter-spacing: 0;
    line-height: 36px;
    font-weight: 500;
  }
</style>