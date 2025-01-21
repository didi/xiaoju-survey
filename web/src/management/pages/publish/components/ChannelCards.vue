<template>
  <div class="channel-cards">
    <div class="channel-card" v-for="(item, index) in data" :key="index">
      <div class="header">
        <div class="title">
          <!-- <el-icon>
            <component :is="CHANNEL_TYPE_ICON[item]" />
          </el-icon> -->
          <span class="name">{{ CHANNEL_TYPE_TEXT[item] }}</span>
        </div>
        <span class="intro" v-if="item == CHANNEL_TYPE.INJECT_APP" @click="handleIntroOpen()">
          接入说明 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <div class="content" @click="() => handleClick(item)">
        <div class="desc">{{ CHANNEL_TYPE_DSEC[item] }}</div>
      </div>
    </div>
  </div>
  <ChannelModify :visible="dialogVisible" @confirm="handleConfirm" @close="handleClose"/>
  <el-dialog
    v-model="introVisible"
    title="SDK接入方式"
    width="800"
    :before-close="handleIntroClose"
  >
    <CodeBlock />
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
import { ref, shallowRef } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { CHANNEL_TYPE, CHANNEL_TYPE_TEXT } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'
import { ElMessageBox } from 'element-plus'
import CodeBlock from './CodeBlock.vue'
import { Link, Aim } from '@element-plus/icons-vue'
import ChannelModify from './ChannelModify.vue'
const channelStore = useChannelStore()
const CHANNEL_TYPE_DSEC = {
  [CHANNEL_TYPE.SHORT_LINK]: '方式描述方式描述方式描述方式描述方式描述方式描述方式描述方式描述',
  [CHANNEL_TYPE.INJECT_WEB]: "将问卷通过SDK方式嵌入到网页中，适合弹窗、信息流等。",
  [CHANNEL_TYPE.INJECT_APP]: "将问卷通过SDK方式嵌入到IOS、Android等应用中。",
  [CHANNEL_TYPE.INJECT_MP]: "将问卷通过SDK嵌入到小程序中，在小程序中进行调查收集。",
}
const CHANNEL_TYPE_ICON = {
  [CHANNEL_TYPE.SHORT_LINK]: Link,
  [CHANNEL_TYPE.INJECT_WEB]: "link",
  [CHANNEL_TYPE.INJECT_APP]: Aim,
  [CHANNEL_TYPE.INJECT_MP]: Link,
}
const data = [
  CHANNEL_TYPE.SHORT_LINK,
  CHANNEL_TYPE.INJECT_WEB,
  CHANNEL_TYPE.INJECT_APP,
  CHANNEL_TYPE.INJECT_MP
]
const dialogVisible = ref(false)
const curType = ref('')
const handleClick = (type: CHANNEL_TYPE) => {
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
    type: curType.value
  })
  dialogVisible.value = false
}
const handleClose = () => {
  dialogVisible.value = false
}
let introVisible = ref(false)
const handleIntroOpen = () => {
  introVisible.value = true
}
const handleIntroClose = () => {
  introVisible.value = false
}
</script> 
<style lang="scss" scoped>
.channel-cards {
  width:  100%;
  .channel-card {
    display: inline-block;
    max-width: 280px;
    // height: 120px;
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
      background: #E3E4E8;
      .intro {
        &:hover{
          color: #FAA600;
        }
      }
      .name{
        font-size: 16px;
        color: #2d2e33;
      }
    }
    .content{
      padding: 12px;
      // font-size: 12px;
      color: #6E707C;
      &:hover {
        background:#efefef;
      }
    }
  }
}
</style>