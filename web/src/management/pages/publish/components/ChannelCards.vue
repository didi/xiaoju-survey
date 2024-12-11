<template>
  <div class="channel-cards">
    <div class="channel-card" v-for="(item, index) in data" :key="index">
      <div class="header">
        <div class="title">
          <!-- <el-icon>
            <component :is="DELIVER_TYPE_ICON[item]" />
          </el-icon> -->
          <span class="name">{{ DELIVER_TYPE_TEXT[item] }}</span>
        </div>
        <span class="intro" v-if="item == DELIVER_TYPE.INJECT_APP" @click="handleIntroOpen()">
          接入说明 <el-icon><ArrowRight /></el-icon>
        </span>
      </div>
      <div class="content" @click="() => handleClick(item)">
        <div class="desc">{{ DELIVER_TYPE_DSEC[item] }}</div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="APP嵌入式问卷"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      style="max-width: 600px"
      :model="channelForm"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item
        label="投放名称："
        prop="name"
        :rules="[
          { required: true, message: '请输入投放名称', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model.number="channelForm.name"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
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
import { DELIVER_TYPE, DELIVER_TYPE_TEXT } from '@/management/enums/channel'
import { useChannelStore } from '@/management/stores/channel'
import { ElMessageBox } from 'element-plus'
import CodeBlock from './CodeBlock.vue'
import { Link, Aim } from '@element-plus/icons-vue'
import type { t } from '@wangeditor/editor'
import type { tr } from 'element-plus/es/locales.mjs'
// <el-icon><Link /></el-icon>
const channelStore = useChannelStore()
const DELIVER_TYPE_DSEC = {
  [DELIVER_TYPE.SHORT_LINK]: '方式描述方式描述方式描述方式描述方式描述方式描述方式描述方式描述',
  [DELIVER_TYPE.INJECT_WEB]: "将问卷通过SDK方式嵌入到网页中，适合弹窗、信息流等。",
  [DELIVER_TYPE.INJECT_APP]: "将问卷通过SDK方式嵌入到IOS、Android等应用中。",
  [DELIVER_TYPE.INJECT_MP]: "将问卷通过SDK嵌入到小程序中，在小程序中进行调查收集。",
}
const DELIVER_TYPE_ICON = {
  [DELIVER_TYPE.SHORT_LINK]: Link,
  [DELIVER_TYPE.INJECT_WEB]: "link",
  [DELIVER_TYPE.INJECT_APP]: Aim,
  [DELIVER_TYPE.INJECT_MP]: Link,
}
const data = [
  DELIVER_TYPE.SHORT_LINK,
  DELIVER_TYPE.INJECT_WEB,
  DELIVER_TYPE.INJECT_APP,
  DELIVER_TYPE.INJECT_MP
]
const dialogVisible = ref(false)
const curType = ref('')
const channelForm = ref({
  name: ''
})
const handleClick = (type: DELIVER_TYPE) => {
  curType.value = type
  switch (type) {
    case DELIVER_TYPE.INJECT_APP:
      dialogVisible.value = true
      break;
    default:
      ElMessageBox.alert(`${DELIVER_TYPE_TEXT[type]}方式即将上线，敬请期待`, '提示')
      break;
  }
  
}

const handleClose = () => {
  dialogVisible.value = false
  channelForm.value = {
    name: ''
  }
}
const formRef = shallowRef()
const handleConfirm = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await channelStore.createChannel({
        name: channelForm.value.name.toString(),
        type: curType.value
      })
      dialogVisible.value = false
      channelForm.value = {
        name: ''
      }
    }
  })
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